import Theme from '../models/Theme';
import { GraphQLScalarType } from 'graphql';

export const themeResolvers = {
    JSON: new GraphQLScalarType({
        name: 'JSON',
        description: 'JSON custom scalar type',
        parseValue(value: any) {
            return value;
        },
        serialize(value: any) {
            return value;
        },
        parseLiteral(ast: any) {
            return ast.value; // Simple fallback
        },
    }),

    Query: {
        getThemes: async (_: any, { category }: { category?: string }) => {
            const filter = category ? { category, isApproved: true } : { isApproved: true };
            return await Theme.find(filter);
        },
        getThemeById: async (_: any, { id }: { id: string }) => {
            return await Theme.findById(id);
        },
    },

    Mutation: {
        submitTheme: async (_: any, { input }: { input: any }, context: any) => {
            const theme = new Theme({
                ...input,
                creatorId: context.user?.id || '6585728a0ed34e32d8479999',
                isApproved: false,
                stats: { downloads: 0, rating: 0 },
                config: {
                    styles: input.config.styles || {},
                    defaultLayouts: input.config.sections || input.config // Support sections array
                }
            });
            await theme.save();
            return theme;
        },
        approveTheme: async (_: any, { id }: { id: string }) => {
            return await Theme.findByIdAndUpdate(id, { isApproved: true }, { new: true });
        },
    },
};
