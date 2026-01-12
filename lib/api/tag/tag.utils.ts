import { skillTagApi } from './tag.service';

/**
 * Resolve skill names to IDs by searching for existing tags or creating new ones
 */
export async function resolveSkillTags(names: string[]): Promise<number[]> {
  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  const ids: number[] = [];

  // Process sequentially to avoid race conditions creating duplicates
  // Could be optimized with Promise.all for searches, then sequential creates
  for (const name of uniqueNames) {
    try {
      // 1. Search for existing tag (prefix search)
      const results = await skillTagApi.search({ prefix: name });

      // Exact case-insensitive match
      const existing = results.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      );

      if (existing) {
        // console.log(`Found existing tag for "${name}": ${existing.id}`);
        ids.push(existing.id);
      } else {
        // 2. Create new tag if not found
        console.log(`Creating new tag for "${name}"`);
        const newTag = await skillTagApi.create({ name });
        ids.push(newTag.id);
      }
    } catch (error) {
      console.error(`Failed to resolve skill tag "${name}":`, error);
      // Continue with other tags even if one fails
    }
  }

  return ids;
}

/**
 * Resolve skill IDs to names by fetching tags
 */
export async function resolveSkillNames(ids: number[]): Promise<string[]> {
  if (!ids || ids.length === 0) return [];

  const uniqueIds = [...new Set(ids)];

  // Parallel fetch optimized
  // In a real app we might want to use a dataloader or cache mechanism
  const promises = uniqueIds.map(async (id) => {
    try {
      const tag = await skillTagApi.get(id);
      return tag.name;
    } catch (e) {
      console.error(`Failed to resolve skill tag ID ${id}`, e);
      return `Skill ${id}`; // Fallback
    }
  });

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}
