import { Page } from './types';

/** nestjs-typeorm-paginate 형태 {items, meta, links}. 다음 페이지가 없으면 links.next 는 빈 문자열 */
export function paginate<T>(all: T[], params: URLSearchParams, extraMeta: { otherCount?: number } = {}): Page<T> {
  const page = Math.max(1, Number(params.get('page')) || 1);
  const limit = Math.max(1, Number(params.get('limit')) || 10);
  const totalPages = Math.max(1, Math.ceil(all.length / limit));
  const items = all.slice((page - 1) * limit, page * limit);
  const link = (p: number) => `?page=${p}&limit=${limit}`;

  return {
    items,
    meta: {
      totalItems: all.length,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      totalCount: all.length,
      otherCount: extraMeta.otherCount ?? 0,
    },
    links: {
      first: link(1),
      previous: page > 1 ? link(page - 1) : '',
      next: page < totalPages ? link(page + 1) : '',
      last: link(totalPages),
    },
  };
}
