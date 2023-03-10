package com.itvitae.swdn.service;

import com.itvitae.swdn.dto.NawDto;
import com.itvitae.swdn.dto.PersonGetDto;
import com.itvitae.swdn.dto.PersonPostDto;
import com.itvitae.swdn.mapper.PersonMapper;
import com.itvitae.swdn.model.Person;
import com.itvitae.swdn.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@Transactional
public class PersonService {
    @Autowired
    PersonRepository personRepository;
    @Autowired
    PersonMapper personMapper;

    //CREATE
    public void addPerson(PersonPostDto personDto) {
        Person newPerson = personMapper.toEntity(personDto);
        personRepository.save(newPerson);
    }

    //READ
    public PersonGetDto getPersonById(long id) {
        Optional<Person> foundPerson = personRepository.findById(id);
        if (!foundPerson.isPresent()) {
            throw new IllegalArgumentException("No such person exists");
        }
        return personMapper.toDto(foundPerson.get());
    }

    public Iterable<PersonGetDto> getAllPeople() {
        return StreamSupport
                .stream(personRepository.findAll().spliterator(), false)
                .map(person -> personMapper.toDto(person))
                .collect(Collectors.toList());
    }


    public void updatePersonById(long id, NawDto nawDto) {
        Optional<Person> foundPerson = personRepository.findById(id);
        if (!foundPerson.isPresent()) {
            throw new IllegalArgumentException("No such person exists");
        }
        Person person = foundPerson.get();
        if (nawDto.getName() != null) {
            person.setName(nawDto.getName());
        }
        if (nawDto.getAddress() != null) {
            person.setAddress(nawDto.getAddress());
        }
        if (nawDto.getCity() != null) {
            person.setCity(nawDto.getCity());
        }

        personRepository.save(person);
    }
}
