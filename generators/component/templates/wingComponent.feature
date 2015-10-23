Feature: <%= comonentName %> test suite

    Scenario: Loading <%= comonentName %>
        Given I have loaded component "<%= comonentName %>" with use case "dataDriven"
        Then the element "dummy" should have the text "TODO <%= comonentName %> contents here."
