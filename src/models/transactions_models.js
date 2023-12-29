const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactions = new Schema({
    ID: {
        type: Number,
        required: true
    },
    Tanggal: {
        type: String,
        required: true
    },
    Keterangan: {
        type: String,
        required: true
    },
    Nominal: {
        type: Number,
        required: true
    },
    Pemasukkan_Pengeluaran: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Transactions", transactions);