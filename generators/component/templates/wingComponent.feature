Feature: <%= componentName %> test suite

    Scenario: Loading <%= componentName %>
        Given I have loaded component "<%= componentName %>" with use case "dataDriven"
        Then the element "dummy" should have the text "TODO <%= componentName %> contents here."
