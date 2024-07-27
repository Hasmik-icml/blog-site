import { Request } from 'express';

export interface IBlogFilters {
    authorId?: string;
    categoryIds?: number[];
    tag?: string[];
}

export default function getFilterParams(req: Request): IBlogFilters {
    const filters: IBlogFilters = {};

    if (req.query.authorId && typeof req.query.authorId === "string") {
        filters.authorId = req.query.authorId;
    }

    if (req.query.categoryIds && typeof req.query.categoryIds === 'string') {
        try {
            const parsed = JSON.parse(req.query.categoryIds);

            if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) {
                filters.categoryIds = parsed;
            } else {
                filters.categoryIds = [];
            }
        } catch (error) {
            filters.categoryIds = [];
        }
    }

    if (req.query.tag && typeof req.query.tag === 'string' ) {
        try {
            const parsed = JSON.parse(req.query.tag);
            if (Array.isArray(parsed)) {
                filters.tag = parsed;
            } else {
                filters.tag = [];
            }
        } catch (error) {
            filters.tag = [];
        }
    }
    return filters;
}