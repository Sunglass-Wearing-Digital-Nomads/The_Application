package com.itvitae.swdn.service;

import com.itvitae.swdn.dto.*;
import com.itvitae.swdn.mapper.PersonMapper;
import com.itvitae.swdn.mapper.UserMapper;
import com.itvitae.swdn.model.*;
import com.itvitae.swdn.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.cert.Certificate;
import java.util.*;

@Service
@Transactional
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PersonRepository personRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    PersonMapper personMapper;
    @Autowired
    RoleService roleService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    EmailService emailService;

    @Autowired
    SkillRepository skillRepository;

    @Autowired
    DBFileRepository dbFileRepository;

    @Autowired
    EvaluationRepository evaluationRepository;

    @Autowired
    InvitationRepository invitationRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    public void newUser(UserPostDto userPostDto, long roleid) {
        User newUser = userMapper.toEntity(userPostDto);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        Person person = personRepository.save(newUser.getPerson());
        newUser.setPerson(person);
        User newerUser = userRepository.save(newUser);
        person.setUser(newerUser);
        person.setRole(roleService.getRoleById(roleid));

        String emailText = "Hello " + person.getName() + ", \n\n"
                + "An account has been created for you.\n"
                + "To log in, use the email " + newerUser.getEmail() + " and the password \"password\"\n"
                + "Once you are logged in, it is recommended you change your password.";

        emailService.sendEmail(newerUser.getEmail(), "Your account has been created", emailText);

        roleService.addPersonToRole(personRepository.save(person));
    }

    public PersonGetDto login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<User> foundUser = userRepository.findByEmailAndDeleted(loginRequest.getEmail(), false);

        if (!foundUser.isPresent()) {
            throw new IllegalStateException("Logged in as nonexistent user");
        }

        Person person = foundUser.get().getPerson();
        return personMapper.toDto(person);
    }

    public void updatePassword(PasswordChange newCredentials) {
        Optional<User> foundUser = userRepository.findByEmail(newCredentials.getEmail());
        if (!foundUser.isPresent()) {
            throw new IllegalArgumentException("No such user exists");
        }
        User user = foundUser.get();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        newCredentials.getOldPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        user.setPassword(passwordEncoder.encode(newCredentials.getNewPassword()));
        userRepository.save(user);
    }


    public void newAdmin(UserPostDto userPostDto, long roleid) {
        User newUser = userMapper.toEntity(userPostDto);
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        Person person = personRepository.save(newUser.getPerson());
        newUser.setPerson(person);
        User newerUser = userRepository.save(newUser);
        person.setUser(newerUser);
        person.setRole(roleService.getRoleById(roleid));

        roleService.addPersonToRole(personRepository.save(person));
    }

    public void deleteUserById(long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("No such user exists");
        }

        User executeeUser = userRepository.findById(id).get();
        Person executeePerson = executeeUser.getPerson();

        //The skills must be executed for their crimes
        List<Skill> skillDeathRow = executeePerson.getSkills();

        List<Invitation> feedbackDeathRow = executeePerson.getSentInvitations();

        List<Evaluation> evaluationDeathRow = executeePerson.getEvaluatorEvaluations();
        evaluationDeathRow.addAll(executeePerson.getTraineeEvaluations());

        int skillCount = skillDeathRow.size();
        int feedbackCount = feedbackDeathRow.size();
        int evaluationCount = evaluationDeathRow.size();


        for (int i = 0; i < feedbackCount; i++) {
            Invitation feedbackThatsGoingToDie = feedbackDeathRow.get(i);
            feedbackThatsGoingToDie.setDeleted(true);
        }

        for (int i = 0; i < evaluationCount; i++) {
            Evaluation evaluationThatsGoingToDie = evaluationDeathRow.get(i);
            evaluationThatsGoingToDie.setDeleted(true);
        }

        for (int i = 0; i < skillCount; i++) {
            Skill skillThatsGoingToDie = skillDeathRow.get(i);
            DBFile fileThatsGoingToDie = skillThatsGoingToDie.getCertificate();
            if (fileThatsGoingToDie != null) {
                fileThatsGoingToDie.setDeleted(true);
            }
            skillThatsGoingToDie.setDeleted(true);
        }

        executeePerson.setDeleted(true);
        executeeUser.setDeleted(true);
        executeeUser.setEmail("[Deleted] " + executeeUser.getEmail());
    }
    public void updateEmail(EmailChange newCredentials){
            Optional<User> foundUser = userRepository.findByEmail(newCredentials.getOldEmail());
            if (!foundUser.isPresent()) {
                throw new IllegalArgumentException("No such user exists");
            }
            User user = foundUser.get();
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            newCredentials.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            user.setEmail(newCredentials.getNewEmail());
            userRepository.save(user);
        }

    public void reactivateAccount(String email) {

        List<User> schrodingersUsers = userRepository.findAllByEmail("[Deleted] " + email);

        User schrodingersUser = Collections.max(schrodingersUsers, Comparator.comparing(c -> c.getId()));;

        if (schrodingersUser.isDeleted()) {

            User reanimatedUser = schrodingersUser;
            Person reanimatedPerson = reanimatedUser.getPerson();

            //Luke 24:6-7
            //He is not here; he has risen!
            List<Skill> reanimatedSkills = reanimatedPerson.getSkills();

            List<Invitation> reanimatedFeedback = reanimatedPerson.getSentInvitations();

            List<Evaluation> reanimatedEvaluations = reanimatedPerson.getEvaluatorEvaluations();
            reanimatedEvaluations.addAll(reanimatedPerson.getTraineeEvaluations());

            int skillCount = reanimatedSkills.size();
            int feedbackCount = reanimatedFeedback.size();
            int evaluationCount = reanimatedEvaluations.size();


            for (int i = 0; i < feedbackCount; i++) {
                Invitation aliveFeedback = reanimatedFeedback.get(i);
                aliveFeedback.setDeleted(false);
            }

            for (int i = 0; i < evaluationCount; i++) {
                Evaluation aliveEvaluation = reanimatedEvaluations.get(i);
                aliveEvaluation.setDeleted(false);
            }

            for (int i = 0; i < skillCount; i++) {
                Skill aliveSkill = reanimatedSkills.get(i);
                DBFile aliveFile = aliveSkill.getCertificate();
                if (aliveFile != null) {
                    aliveFile.setDeleted(false);
                }
                aliveSkill.setDeleted(false);
            }

            reanimatedUser.setEmail(email);
            reanimatedPerson.setDeleted(false);
            reanimatedUser.setDeleted(false);
        } else {
            throw new IllegalArgumentException("No such user has existed, or the user has not been deleted");
        }
    }
}

