Feature: <%= widgetName %> test suite

    Scenario: Loading <%= widgetName %>
        Given I have loaded widget "<%= widgetName %>" with use case "dataDriven"
        Then the element "dummy" should have the text "TODO <%= widgetName %> contents here."
