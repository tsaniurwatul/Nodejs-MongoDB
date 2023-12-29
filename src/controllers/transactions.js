const {validationResult} = require("express-validator");
const transactions = require("../models/transactions_models");
const path = require("path");
const fs = require("fs");



//Read Transactions
exports.getAllTransactions = (req,res, next) => {

    const currentPage = req.query.page || 1; //ketika client tidak mengirimkan query perpage
    const perPage = req.query.perPage || 10; //ketika client mengirimkan query perpage
    let totalData;

    transactions.find()
    .countDocuments()
    .then((count) => {
        totalData = count;
        return transactions.find().skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
    })
        .then((result) => {
            res.status(200).json({
                message: "Success get all data",
                totalData: totalData,
                perPage: parseInt(perPage),
                currentPage: parseInt(currentPage),
                data: result,
            });
        })
    .catch(err => {
        next(err);
    });
};

exports.getTransactionsByID = (req,res, next) => {
    const id = req.params.id;
    transactions.findById(id)
    .then(result => {
       if (!result) {
            const error = new Error("Data not found");
            error.errorStatus = 400;
            throw error;
       }
        res.status(200).json({
            message: "Success get data " + id,
            data: result,
        });
    })
    .catch(err => {
        next(err);
    });
};

// Create Transactions
exports.createTransactions = (req, res, next) => {
    const errors = validationResult(req);

    // Validation
    if (!errors.isEmpty()) {
        const err = new Error("Invalid value");
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    // // If no file is uploaded
    // if (!req.file) {
    //     const err = new Error("Image not uploaded");
    //     err.errorStatus = 422;
    //     throw err;
    // }

    // Assuming that ID, Tanggal, Keterangan, Nominal, Pemasukkan_Pengeluaran are present in req.body
    const { ID, Tanggal, Keterangan, Nominal, Pemasukkan_Pengeluaran } = req.body;

    const PostingTransactions = new transactions({
        ID: ID,
        Tanggal: Tanggal,
        Keterangan: Keterangan,
        Nominal: Nominal,
        Pemasukkan_Pengeluaran: Pemasukkan_Pengeluaran,
        // image: req.file.path,
        author: { uid: 1, name: "Tsani & Sara" },
    });

    PostingTransactions.save()
        .then((result) => {
            res.status(201).json({
                status: 201,
                message: "Success create new transaction",
                data: result,
            });
        })
        .catch((err) => {
            console.log("Error [create new transaction] => ", err);
            next(err);
        });
};

// Update Transactions
exports.updateTransactions = (req, res, next) => {
    const { id } = req.params;
    const { ID, Tanggal, Keterangan, Nominal, Pemasukkan_Pengeluaran } = req.body;
    const errors = validationResult(req);

    // Validation
    if (!errors.isEmpty()) {
        const err = new Error("Invalid value");
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }

    // // If no file is uploaded
    // if (!req.file) {
    //     const err = new Error("Image not uploaded");
    //     err.errorStatus = 422;
    //     throw err;
    // }

    transactions.findById(id)
        .then((transaction) => {
            if (!transaction) {
                const err = new Error("Data not found");
                err.errorStatus = 404;
                throw err;
            }

            transaction.ID = ID;
            transaction.Tanggal = Tanggal;
            transaction.Keterangan = Keterangan;
            transaction.Nominal = Nominal;
            transaction.Pemasukkan_Pengeluaran = Pemasukkan_Pengeluaran;
            // transaction.image = req.file.path;

            return transaction.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Success update data",
                data: result,
            });
        })
        .catch((err) => {
            next(err);
        });
};

// Delete Transactions
exports.deleteTransactions = (req, res, next) => {
    const { id } = req.params;
    transactions.findById(id)
        .then((transaction) => {
            // Validasi inputan
            if (!transaction) {
                const err = new Error("Data not found");
                err.errorStatus = 404;
                throw err;
            }

            // // Hapus iamge
            // removeImage(transaction.image);
            // Hapus dari database
            return transactions.findByIdAndDelete(id);
        })
        .then((result) => {
            res.status(200).json({
                message: "Success delete data",
                data: result,
            });
        })
        .catch((err) => {
            next(err);
        });
};

// const removeImage = (filePath) => {
//     filePath = path.join(__dirname, "../..", filePath);
//     fs.unlink(filePath, (err) => console.log(err));
// }

    /*
    const result = {
        message: "Create blog success",
        data: {
            blog_id: 1,
            title: req.body.title,
            image: "image.png",
            body: req.body.body,
            created_at: "26/12/2023",
            auth: {
                uid: 1,
                name: "TsaniSara",
            },
        },
    };

    res.status(201).json(result);
    console.log("request body : ", req.body);
    res.json({status: 200, message: "Success create blog"});
    next();
    */

