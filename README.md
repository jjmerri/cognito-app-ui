# Cognito App UI

This app is an example of a minimal setup to get a React ui authenticating with Amazon Cognito with email verification and password reset.

The app requires a Cognito user pool and user pool client. Run this command to create the resources in your account:

`aws cloudformation create-stack --stack-name testcognitostack --template-body file://cognito.yaml`

Once the stack is created you can get the user pool id and client id by running the below command:

`aws cloudformation describe-stacks --query "Stacks[?StackName=='testcognitostack'][]" --output text`

create a `.env.local` file alongside the existing `.env` file and put the values that printed from the above command in it.

Start the app:

```
yarn install
yarn run dev
```
