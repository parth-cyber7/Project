import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'DDD eCommerce API',
      version: '1.0.0',
      description: 'Production-ready eCommerce backend with DDD architecture'
    },
    servers: [
      {
        url: '/api',
        description: 'API base path'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        AuthLoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          },
          required: ['email', 'password']
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            category: { type: 'string' },
            imageUrl: { type: 'string' }
          }
        }
      }
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register customer account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' }
                  },
                  required: ['name', 'email', 'password']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Customer created' }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login as admin or customer',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/AuthLoginRequest'
                }
              }
            }
          },
          responses: {
            '200': { description: 'Login successful' }
          }
        }
      },
      '/products': {
        get: {
          tags: ['Products'],
          summary: 'List products with pagination and filters',
          responses: {
            '200': { description: 'Product list' }
          }
        },
        post: {
          tags: ['Products'],
          summary: 'Create product (admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          },
          responses: {
            '201': { description: 'Product created' }
          }
        }
      },
      '/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Place order from current cart (customer only)',
          security: [{ bearerAuth: [] }],
          responses: {
            '201': { description: 'Order created' }
          }
        },
        get: {
          tags: ['Orders'],
          summary: 'List all orders (admin only)',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Orders listed' }
          }
        }
      },
      '/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Get dashboard metrics',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Dashboard data' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: []
});
