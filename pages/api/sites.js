import { getAllSites } from "@/lib/db-admin";

export default async (_, res) => {
    const result = await getAllSites();

    if (result.error) {
        res.status(500).json({ error: result.error });
    } else {
        res.status(200).json({ sites: result.sites });
    }
};
