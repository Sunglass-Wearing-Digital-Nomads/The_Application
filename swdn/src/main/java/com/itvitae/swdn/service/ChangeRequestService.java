package com.itvitae.swdn.service;

import com.itvitae.swdn.dto.ChangeRequestDto;
import com.itvitae.swdn.mapper.ChangeRequestMapper;
import com.itvitae.swdn.model.ChangeRequest;
import com.itvitae.swdn.model.Person;
import com.itvitae.swdn.repository.ChangeRequestRepository;
import com.itvitae.swdn.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ChangeRequestService {

    @Autowired
    ChangeRequestRepository changeRequestRepository;

    @Autowired
    ChangeRequestMapper changeRequestMapper;

    @Autowired
    PersonRepository personRepository;
    public void addChangeRequest(ChangeRequestDto changeRequestDto, long personid) {
        Person person = personRepository.findById(personid).get();
        ChangeRequest newChangeRequest = changeRequestMapper.toEntity(changeRequestDto);
        if(person.getChangeRequest() == null){
            person.setChangeRequest(newChangeRequest);
            newChangeRequest.setRequester(person);
            changeRequestRepository.save(newChangeRequest);
        } else {
            Long id = person.getChangeRequest().getId();
            updateChangeRequest(changeRequestDto, id);
        }

    }

    private void updateChangeRequest(ChangeRequestDto changeRequestDto, Long id) {
        if (!changeRequestRepository.existsById(id)) {
            //do nothing
        } else {
            ChangeRequest oldChangeRequest = changeRequestRepository.findById(id).get();
            if (oldChangeRequest.getName() != null) {
                oldChangeRequest.setName(changeRequestDto.getName());
            }
            if (oldChangeRequest.getAddress() != null) {
                oldChangeRequest.setAddress(changeRequestDto.getAddress());
            }
            if (oldChangeRequest.getCity() != null) {
                oldChangeRequest.setCity(changeRequestDto.getCity());
            }

            changeRequestRepository.save(oldChangeRequest);
        }

    }
}
