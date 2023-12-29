const express = require("express");
const router = express.Router();
const {body} = require("express-validator");
const transactionsController = require("../controllers/transactions");
const requireAuth = require("../middlewares/requireAuth");

router.get("/transactions", transactionsController.getAllTransactions);
router.get("/transactions/:id", transactionsController.getTransactionsByID);
router.post(
    "/", requireAuth,
    [
        body("ID").isNumeric().withMessage("ID must be a number"),
        body("Tanggal").isString().notEmpty().withMessage("Tanggal is required"),
        body("Keterangan").isString().notEmpty().withMessage("Keterangan is required"),
        body("Nominal").isNumeric().withMessage("Nominal must be a number"),
        body("Pemasukkan_Pengeluaran").isString().notEmpty().withMessage("Pemasukkan/Pengeluaran is required"),
    ],
    transactionsController.createTransactions
);
router.put(
    "/transactions/:id",requireAuth,
    [
        body("ID").isNumeric().withMessage("ID must be a number"),
        body("Tanggal").isString().notEmpty().withMessage("Tanggal is required"),
        body("Keterangan").isString().notEmpty().withMessage("Keterangan is required"),
        body("Nominal").isNumeric().withMessage("Nominal must be a number"),
        body("Pemasukkan_Pengeluaran").isString().notEmpty().withMessage("Pemasukkan/Pengeluaran is required"),
        // Tambahkan validasi untuk field lainnya jika diperlukan
    ],
    transactionsController.updateTransactions
);

router.delete("/transactions/:id",requireAuth, transactionsController.deleteTransactions);

module.exports = router;