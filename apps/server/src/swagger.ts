import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ryder Api',
      version: '1.0.0',
      description: 'Describes all the available APIs on the Ryder App',
    },
  },
  // Path to your route files
  apis: ['src/routes/v1/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
