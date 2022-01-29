import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
	Function as LambdaFunction,
	Runtime,
	Code,
} from 'aws-cdk-lib/aws-lambda'
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { join } from 'path'
import { GenericTable } from './GenericTable'
export class SpaceStack extends Stack {
	private api = new RestApi(this, 'SpaceApi')
	private spacesTable = new GenericTable('SpacesTable', 'spaceId', this)

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)
		const helloLambda = new LambdaFunction(this, 'helloLambda', {
			runtime: Runtime.NODEJS_14_X,
			code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')),
			handler: 'hello.main',
		})

		// Hello Api lambda integration:
		const helloLambdaIntegration = new LambdaIntegration(helloLambda, {
			allowTestInvoke: true,
		})

		const helloLambdaResource = this.api.root.addResource('hello')
		helloLambdaResource.addMethod('GET', helloLambdaIntegration)
	}
}
