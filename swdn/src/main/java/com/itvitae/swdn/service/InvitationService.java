package com.itvitae.swdn.service;

import com.itvitae.swdn.dto.InvitationDto;
import com.itvitae.swdn.dto.InvitationGetDto;
import com.itvitae.swdn.dto.InvitationPutDto;
import com.itvitae.swdn.mapper.InvitationMapper;
import com.itvitae.swdn.model.Invitation;
import com.itvitae.swdn.model.Person;
import com.itvitae.swdn.repository.InvitationRepository;
import com.itvitae.swdn.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class InvitationService {
    @Autowired
    EmailService emailService;

    @Autowired
    InvitationMapper invitationMapper;

    @Autowired
    PersonRepository personRepository;
    @Autowired
    InvitationRepository invitationRepository;

    public void newInvitation(InvitationDto invitationDto, long requesterid) {
        Invitation invitation = invitationMapper.toEntity(invitationDto);
        Person requester = personRepository.findById(requesterid).get();

        if(!invitation.getFeedbackGiver().getUser().getEmail().equals(requester.getUser().getEmail())) {

            Person giver = StreamSupport
                    .stream(personRepository.findAll().spliterator(), false)
                    .filter(person -> Objects.equals(person.getUser().getEmail(), invitationDto.getEmail()))
                    .filter(person -> Objects.equals(person.getRole().getName(), "TRAINEE"))
                    .findFirst()
                    .orElse(null);


            if (giver != null) {
                String emailText = "Hello " + giver.getName() + ", \n\n"
                        + "You have received an invitation from " + requester.getName() + " to give them 360 feedback.";

                emailService.sendEmail(giver.getUser().getEmail(), "Feedback Request", emailText);

                giver.getReceivedInvitations().add(invitation);
                requester.getSentInvitations().add(invitation);
                invitation.setFeedbackAsker(requester);
                invitation.setFeedbackGiver(giver);
                invitationRepository.save(invitation);
            } else {
                throw new RuntimeException("email not found");
            }
        } else {
            throw new RuntimeException("giver and requester are the same person");
        }
    }

    public Iterable<InvitationGetDto> getRequestersByGiver(Long giverid) {
        return StreamSupport
                .stream(invitationRepository.findAll().spliterator(), false)
                .filter(invitation -> Objects.equals(invitation.getFeedbackGiver().getId(), giverid))
                .filter(invitation -> !invitation.getFeedbackGiver().isDeleted())
                .map(invitation -> invitationMapper.toDto(invitation))
                .collect(Collectors.toList());
    }

    public Iterable<InvitationGetDto> getGiversByRequester(Long requesterid) {
        return StreamSupport
                .stream(invitationRepository.findAll().spliterator(), false)
                .filter(invitation -> Objects.equals(invitation.getFeedbackAsker().getId(), requesterid))
                .map(invitation -> invitationMapper.toDto(invitation))
                .collect(Collectors.toList());
    }

    public void giveFeedback(long id, InvitationPutDto invitation) {
        if (!invitationRepository.existsById(id)) {
            //do nothing
        } else {
            Invitation oldInvitation = invitationRepository.findById(id).get();
            if (invitation.getFeedback() != null) {
                oldInvitation.setFeedback(invitation.getFeedback());
                String emailText = "Hello " + oldInvitation.getFeedbackAsker().getName() + ", \n\n"
                        + oldInvitation.getFeedbackGiver().getName() + " has given you feedback:\n"
                        + oldInvitation.getFeedback();

                emailService.sendEmail(oldInvitation.getFeedbackAsker().getUser().getEmail(),
                        "You have feedback", emailText);

            }
            invitationRepository.save(oldInvitation);
        }
    }

    // 1x a day = 86400000, 1x a minute = 60000
    @Scheduled(fixedRate = 86400000)
    public void checkForUnansweredRequests() {
        System.out.println("Checking for unanswered feedback requests...");
        StreamSupport.stream(
                        invitationRepository.findAll().spliterator(), false)
                .filter(invitation -> invitation.getFeedback() == null)
                .forEach(invitation -> emailService.sendEmail(
                        invitation.getFeedbackGiver().getUser().getEmail(),
                        "Remember to give feedback!",
                        "Dear " + invitation.getFeedbackGiver().getName() + ",\n\n" +
                                "Don't forget, you still have to give 360 feedback to " + invitation.getFeedbackAsker().getName() + " today!\n" +
                                "This is your daily reminder. You will continue receiving these mails once a day until you manage to give feedback."));
    }

}
