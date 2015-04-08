# 0.3.1
- Merged PR #62 to fix junitreport hard-coded options

# 0.2.1
- multi-task configuration support added
- coffeescript support fixed
- fixed issue with projectRoot defaulting to entire project when it was not specified in the config, the projectRoot will now default to being empty and not adding the entire project folder if it is not specified in the task configuration
- added growl option to configuration
- added fix so the task fails if Jasmine tests fail
