import express, { Express } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { tenantContext } from './middleware/tenantContext';
import { ApolloServer } from 'apollo-server-express';
import { themeTypeDefs } from './schema/theme.schema';
import { themeResolvers } from './resolvers/theme.resolver';
import assetRoutes from './routes/asset.route';
import formRoutes from './routes/form.route';
import aiRoutes from './routes/ai.route';
import authRoutes from './routes/auth.route';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(tenantContext);
app.use('/api/assets', assetRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

async function startServer() {
    const server = new ApolloServer({
        typeDefs: themeTypeDefs,
        resolvers: themeResolvers,
        context: ({ req }) => ({
            user: (req as any).user, // Auth middleware would set this
            tenant: (req as any).tenant
        })
    });

    await server.start();
    server.applyMiddleware({ app: app as any });

    // Database Connection
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webbuilder';

    mongoose.connect(MONGODB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
            app.listen(PORT, () => {
                console.log(`Backend Server running on port ${PORT}`);
                console.log(`GraphQL endpoint available at http://localhost:${PORT}${server.graphqlPath}`);
            });
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
}

startServer();

export default app;
