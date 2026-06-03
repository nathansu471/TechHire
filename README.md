
# Specification Document

### Project Abstract

Our project is meant to be a functioning job board similar to Indeed and LinkedIn. The board will either pull existing jobs/positions from a public API or the users will be able to add positions to the board which will be stored via a database. Users will also be able to filter positions by certain specifications as well as search. The board might also potentially have a login system so users will be able to login and view their applied jobs and potentially the status of applications as well. 

### Customer

Any person who is looking for a job/intern position. The product will be able to help aid those who are searching in potentially finding positions that match what they are looking for as well as track their efforts.

### Specification

<!--A detailed specification of the system. UML, or other diagrams, such as finite automata, or other appropriate specification formalisms, are encouraged over natural language.-->

<!--Include sections, for example, illustrating the database architecture (with, for example, an ERD).-->

<!--Included below are some sample diagrams, including some example tech stack diagrams.-->

https://www.figma.com/design/OOJt9HEn9SddZREkRkMvNj/CS506-Project?node-id=0-1&t=9z6vuMMJKrb4pN44-1

#### Technology Stack

Here are some sample technology stacks that you can use for inspiration:

```mermaid
flowchart RL
subgraph Front End
	A(Javascript: React)
end
	
subgraph Back End
	B(Python)
end
	
subgraph Database
	C[(MySQL)]
end

A <-->|"REST API"| B
B <--> C
```


```mermaid
---
title: Job Board Database ERD
---
erDiagram
    users ||--o{ company_users : is_assigned_to
    companies ||--o{ company_users : has_managers
    companies ||--o{ jobs : posts
    jobs ||--o{ applications : receives

    users {
        BIGINT id PK
        string email
        string password_hash
        string name
        string role
        timestamp created_at
    }

    companies {
        BIGINT id PK
        string name
        string website
        string location
        string logo_url
        timestamp created_at
    }

    company_users {
        BIGINT company_id FK
        BIGINT user_id FK
        string role
    }

    jobs {
        BIGINT id PK
        BIGINT company_id FK
        string title
        string description_md
        string location
        string job_type
        string work_mode
        string experience_required
        string education_level
        date date_posted
        boolean remote_ok
        int salary_min
        int salary_max
        string currency
        string status
        timestamp created_at
        timestamp updated_at
    }

    applications {
        BIGINT id PK
        BIGINT job_id FK
        string seeker_name
        string seeker_email
        string resume_url
        string cover_letter_md
        string status
        timestamp created_at
    }

```

#### Class Diagram


#### Flowchart

```mermaid
---
title: Sample Program Flowchart
---
graph TD;
    Start([Start]) --> Input_Data[/Input Data/];
    Input_Data --> Process_Data[Process Data];
    Process_Data --> Validate_Data{Validate Data};
    Validate_Data -->|Valid| Process_Valid_Data[Process Valid Data];
    Validate_Data -->|Invalid| Error_Message[/Error Message/];
    Process_Valid_Data --> Analyze_Data[Analyze Data];
    Analyze_Data --> Generate_Output[Generate Output];
    Generate_Output --> Display_Output[/Display Output/];
    Display_Output --> End([End]);
    Error_Message --> End;
```

#### Behavior

```mermaid
---
title: Sample State Diagram For Coffee Application
---
stateDiagram
    [*] --> Ready
    Ready --> Brewing : Start Brewing
    Brewing --> Ready : Brew Complete
    Brewing --> WaterLowError : Water Low
    WaterLowError --> Ready : Refill Water
    Brewing --> BeansLowError : Beans Low
    BeansLowError --> Ready : Refill Beans
```

#### Sequence Diagram

```mermaid
sequenceDiagram

participant ReactFrontend
participant DjangoBackend
participant MySQLDatabase

ReactFrontend ->> DjangoBackend: HTTP Request (e.g., GET /api/data)
activate DjangoBackend

DjangoBackend ->> MySQLDatabase: Query (e.g., SELECT * FROM data_table)
activate MySQLDatabase

MySQLDatabase -->> DjangoBackend: Result Set
deactivate MySQLDatabase

DjangoBackend -->> ReactFrontend: JSON Response
deactivate DjangoBackend
```
