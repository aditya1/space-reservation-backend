import { DynamoDB } from 'aws-sdk'
import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from 'aws-lambda'

const TABLE_NAME = process.env.TABLE_NAME
const PRIMARY_KEY = process.env.PRIMARY_KEY
const dbClient = new DynamoDB.DocumentClient()

async function handler(
	event: APIGatewayProxyEvent,
	contex: Context
): Promise<APIGatewayProxyResult> {
	const result: APIGatewayProxyResult = {
		statusCode: 200,
		body: 'Hello from DynamoDb',
	}

	try {
		if (event.queryStringParameters) {
			if (PRIMARY_KEY! in event.queryStringParameters) {
				const keyVal = event.queryStringParameters[PRIMARY_KEY!]
				const queryResp = await dbClient
					.query({
						TableName: TABLE_NAME!,
						KeyConditionExpression: '#zz = :zzzz',
						ExpressionAttributeNames: {
							'#zz': PRIMARY_KEY!,
						},
						ExpressionAttributeValues: {
							':zzzz': keyVal,
						},
					})
					.promise()
				result.body = JSON.stringify(queryResp)
			}
		} else {
			const queryResp = await dbClient
				.scan({ TableName: TABLE_NAME! })
				.promise()
			result.body = JSON.stringify(queryResp)
		}
	} catch (error) {
		//result.body = error.message || ''
	}

	return result
}

export { handler }
