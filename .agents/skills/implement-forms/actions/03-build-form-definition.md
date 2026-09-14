# 03-build-form-definition

## Purpose

Create the versioned FormDefinition with contact mode, dynamic fields, quiz config, consent, attribution and success behavior.

## Inputs

- pattern
- approved requirements

## Process

1. Start from the template.
2. Define stable form/page identity and conversion event.
3. Define canonical contact mode.
4. Define dynamic fields/quiz/consent/attribution/success.
5. Treat `FormDefinition` and `CanonicalLeadSubmission` as the stable seams for the feature. Define/validate those seams before component internals.
6. Validate before coding.

## Outputs

- FormDefinition

## Test

Client-specific programme/campus/quiz fields must stay dynamic and must not become canonical DB columns.
