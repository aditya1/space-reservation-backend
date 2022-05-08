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
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
PolicyStatement
export class SpaceStack extends Stack {
	private api = new RestApi(this, 'SpaceApi')
	//private spacesTable = new GenericTable('SpacesTable', 'spaceId', this)
	private spacesTable = new GenericTable(this, {
		tableName: 'SpacesTable',
		primaryKey: 'spaceId',
		createLambdaPath: 'Create',
		readLambdaPath: 'Read',
	})
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

		const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
			entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
			handler: 'handler',
		})
		const s3ListPolicy = new PolicyStatement()
		s3ListPolicy.addActions('s3:ListAllMyBuckets')
		s3ListPolicy.addResources('*')
		helloLambdaNodeJs.addToRolePolicy(s3ListPolicy)

		// Hello Api lambda integration:
		const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs, {
			allowTestInvoke: true,
		})

		const helloLambdaResource = this.api.root.addResource('hello')
		helloLambdaResource.addMethod('GET', helloLambdaIntegration)

		//Spaces API Integration

		const spaceRescource = this.api.root.addResource('spaces')
		spaceRescource.addMethod('POST', this.spacesTable.createLambdaIntegration)
		spaceRescource.addMethod('GET', this.spacesTable.readLambdaIntegration)
	}
}
