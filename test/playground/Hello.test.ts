//import { handler } from '../../services/node-lambda/hello'
import { handler } from '../../services/SpacesTable/Read'
import { APIGatewayProxyEvent } from 'aws-lambda'

const event: APIGatewayProxyEvent = {
	queryStringParameters: {
		spaceId: '816c84fe-14cc-4e93-8811-b946d703496f',
	},
} as any
//handler({}, {})
const result = handler(event, {} as any).then((apiResult) => {
	const items = JSON.parse(apiResult.body)
	console.log(123)
})
