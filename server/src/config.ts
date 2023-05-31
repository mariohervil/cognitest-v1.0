const Config = {
	port: process.env.PORT || 8080,
	connectionString: `mongodb+srv://root:${process.env.MONGOPWD}@guttmann.nlwqyzd.mongodb.net/?retryWrites=true&w=majority`,
};
export default Config;
