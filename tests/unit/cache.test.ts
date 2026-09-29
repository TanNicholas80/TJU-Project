import { describe, it, expect, beforeEach } from "vitest";
import { cache } from "@/lib/cache";

describe("Multi-tier Cache Service", () => {
  beforeEach(async () => {
    await cache.delByPrefix("test:");
  });

  it("should set and get values correctly with fallback memory layer", async () => {
    await cache.set("test:key1", { name: "TJU Truss", established: 2011 });
    const cached = await cache.get<{ name: string; established: number }>("test:key1");

    expect(cached).toBeDefined();
    expect(cached?.name).toBe("TJU Truss");
    expect(cached?.established).toBe(2011);
  });

  it("should delete specific key correctly", async () => {
    await cache.set("test:to_delete", "delete_me");
    expect(await cache.get("test:to_delete")).toBe("delete_me");

    await cache.del("test:to_delete");
    expect(await cache.get("test:to_delete")).toBeNull();
  });

  it("should delete keys by prefix pattern", async () => {
    await cache.set("test:prefix:a", "A");
    await cache.set("test:prefix:b", "B");
    await cache.set("other:prefix:c", "C");

    await cache.delByPrefix("test:prefix");

    expect(await cache.get("test:prefix:a")).toBeNull();
    expect(await cache.get("test:prefix:b")).toBeNull();
    expect(await cache.get("other:prefix:c")).toBe("C");
  });

  it("should execute getOrSet fetch function on cache miss and return cached value on hit", async () => {
    let executionCount = 0;
    const fetcher = async () => {
      executionCount++;
      return { project: "UNNES Truss", status: "completed" };
    };

    const firstCall = await cache.getOrSet("test:fetch_test", fetcher, 60);
    expect(firstCall.project).toBe("UNNES Truss");
    expect(executionCount).toBe(1);

    const secondCall = await cache.getOrSet("test:fetch_test", fetcher, 60);
    expect(secondCall.project).toBe("UNNES Truss");
    expect(executionCount).toBe(1); // Cached! Not called again
  });
});
