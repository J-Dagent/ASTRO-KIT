# 07-run-implementation-checks

## Purpose

Run relevant typecheck/build/tests and targeted browser checks as changes land.

## Inputs

- code changes

## Process

1. Run targeted tests while editing.
2. Run typecheck/build.
3. Run real browser checks when relevant.
4. Run full test suite once at the end when configured.

## Outputs

- check results

## Test

Run executable checks when available rather than claiming success from static review.
