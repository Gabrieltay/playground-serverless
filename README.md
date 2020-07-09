# playground-serverless
## create inital boilerplate
```bash
serverless create --template aws-nodejs
```

## create package.json
```bash
npm init
```

## create IAM User in aws console
- note the credentials and create the profile
- the profile is created in ~/.aws/credentials
```bash
serverless config credentials --provider aws --key <IAM_KEY> --secret <IAM_SECRET> --profile aws-personal-profile
```

## Install the aws-sdk
```bash
npm install aws-sdk --save
```

## Deploy lambda service
```bash
serverless deploy --aws-profile aws-personal-profile --stage dev
```

## Remove lambda service
```bash
serverless remove --aws-profile aws-personal-profile --stage dev
```

Endpoints:
```text
  POST: /v1/toy
```
Body:

```json
[
    {
        "name": "Lego",
        "price": "$59.90"
    }
]
```

```text
  GET: /v1/toy
```
Returns:

```json
{
    "name": "Lego",
    "price": "$59.90"
}
```

## Monitor logs
```bash
serverless logs -f create --stage dev --aws-profile aws-personal-profile
```

# Local development
Install dynamodb locally

```
sls dynamodb install
```

Start dynamodb

```
sls dynamodb start
```

Run locally against dynamodb-locally
```
npm run dev
```
