package edu.usc.csci310.project.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class SearchRequest {
    String searchTerm;
    String searchCriteria;
//    int limit;
    int start;
}
