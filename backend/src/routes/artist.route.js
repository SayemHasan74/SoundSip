import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
        getAllArtists,
        getArtistProfile,
        createOrUpdateArtistProfile,
        submitVerification,
        getVerificationStatus,
        updateVerificationStatus,
        searchArtists,
        searchArtistsAutocomplete
} from "../controller/artist.controller.js";

const router = Router();

// Public routes (no authentication required)
router.get("/", getAllArtists);
router.get("/search", searchArtists);
router.get("/autocomplete", searchArtistsAutocomplete);
router.get("/:id", getArtistProfile);

// Protected routes (authentication required)
router.post("/profile", protectRoute, createOrUpdateArtistProfile);
router.post("/verify", protectRoute, submitVerification);
router.get("/verification/status", protectRoute, getVerificationStatus);

// Admin routes (admin authentication required)
router.put("/verification/:userId", protectRoute, requireAdmin, updateVerificationStatus);

export default router;
