package com.itvitae.swdn.service;

import com.itvitae.swdn.dto.SkillGetDto;
import com.itvitae.swdn.dto.SkillPostDto;
import com.itvitae.swdn.mapper.SkillMapper;
import com.itvitae.swdn.model.Person;
import com.itvitae.swdn.model.Skill;
import com.itvitae.swdn.repository.PersonRepository;
import com.itvitae.swdn.repository.SkillRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class SkillService {

    @Autowired
    SkillMapper skillMapper;

    @Autowired
    SkillRepository skillRepository;

    @Autowired
    PersonRepository personRepository;
    public Iterable<SkillGetDto> getAllSkills() {
        return StreamSupport
                .stream(skillRepository.findAll().spliterator(), false)
                .map(skill -> skillMapper.toDto(skill))
                .collect(Collectors.toList());
    }

    public SkillGetDto getSkillById(long id) {
        Optional<Skill> foundSkill = skillRepository.findById(id);
        if (!foundSkill.isPresent()) {
            throw new IllegalArgumentException("No such person exists");
        }
        return skillMapper.toDto(foundSkill.get());
    }

    public void newSkill(SkillPostDto skillDto, long personid) {
        Skill newSkill = skillMapper.toEntity(skillDto);
        Person person = personRepository.findById(personid).get();
        person.getSkills().add(newSkill);
        newSkill.setTrainee(person);
        skillRepository.save(newSkill);
    }
}
