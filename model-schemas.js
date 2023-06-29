
const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    assigned_to: {type: String},
    status_text: {type: String},
    created_on: {type: Date},
    updated_on: {type: Date}, 
    open: {type: Boolean}, 
})

const Issue = mongoose.model('Issue', IssueSchema)

const IssueArraySchema = new mongoose.Schema({
  name: {type: String}, 
  issues: [IssueSchema]
})

const IssueArray = mongoose.model("IssueArray", IssueArraySchema)

exports.Issue = Issue
exports.IssueArray = IssueArray