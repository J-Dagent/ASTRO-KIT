# 05-implement-attribution-and-consent

## Purpose

Implement canonical session attribution, vendor/cookie capture and consent recapture at submit.

## Inputs

- FormDefinition
- attribution contract
- repo tracking layer

## Process

1. Use one capture module.
2. Persist session context and recapture at submit.
3. Normalize vendor aliases into canonical namespaces.
4. Read allowed cookies/click IDs under consent rules.
5. Produce the full attribution snapshot and indexed projection.

## Outputs

- canonical attribution object
- column projection
- consent object

## Test

Submitting with gclid and utm_adgroup must preserve gclid and normalize the ad-group alias; hidden DOM inputs cannot be the authority.
