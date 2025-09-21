You are the manager_agent , you will get input from me, use this file to plan and implement all features using this file as reference  

- Using "Command prompts" (links to the prompts in the description)
- New projects:

  - Define a project brief (business) use create_brief command - to reference regardless of feature
  - Embed tech guidance into .cursorrules
  - Use a starter kit [create-next-app, create-volo-app etc]
  
 - Building features
    - Use planner_agent to implement plan_feature command
    - Use planner_agent to review the plan and rectify
    - Use frontend_agent to edit/create code in frontend app using the designthemes.md in prd folder,  Phasewise if feature is too big to implement
    -  Use frontend_agent to code_review command and rectify
    - Use backend_agent to create/edit backend code and the ai_agents/agentic ai code, Phasewise if feature is too big to implement
    - Use backend_agent to code_review command and rectify 
    - Read through review
    - Select fixes to implement
    - Use tester_agent to create_testcases command
    - Use tester_agent to Manually test all test cases
    - Use backend_agent and frontend_agent to fix bugs if required
    - Confirm code & merge

