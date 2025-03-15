package edu.usc.csci310.project.repository;

import edu.usc.csci310.project.entity.MyUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyUserRepository extends CrudRepository<MyUser, Long> {
}
