import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { CreateMessageBody } from "@workspace/api-zod";

const router = Router();

router.get("/messages", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt))
    .limit(50);

  const messages = rows.map((m) => ({
    id: m.id,
    name: m.name,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  res.json(messages);
});

router.post("/messages", async (req, res): Promise<void> => {
  const parsed = CreateMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(messagesTable)
    .values({ name: parsed.data.name, body: parsed.data.body })
    .returning();

  res.status(201).json({
    id: row.id,
    name: row.name,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  });
});

export default router;
