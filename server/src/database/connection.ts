import * as mongoose from 'mongoose';
import { ConnectOptions } from 'mongoose';

/**
 *
 * Registers a database connection using the specified configuration
 * @param Config
 *
 */
const RegisterDatabaseConnection = async (Config: any) => {
	mongoose.set('strictQuery', true);
	await mongoose
		.connect(Config.connectionString, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions)
		.then((db) => {
			console.log('Database connection stablished.');
		});
};





export default RegisterDatabaseConnection;
