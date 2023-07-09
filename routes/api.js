
'use strict';
// const IssueModel = require("../model-schemas").Issue
const IssueArrayModel = require("../model-schemas").IssueArray

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      IssueArrayModel
        .findOne({ name: project })
        .then( result => {
          if (result) {
            let issueArr = result.issues
            let filters = req.query

            // if filters = {}, for loop is omiited
            const filteredIssue = issueArr.filter( issue => {
              for (const key in filters) {
                if (issue[key] !== filters[key]) {
                  if (issue._id.toString() === filters._id) {
                    return true;
                  } else {
                    return false
                  }
                }
              }
              return true
            })

            res.json(filteredIssue)
          } else {
            res.json({})
          }
        })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
      let currentDateTime = new Date();

      let newIssueObj = {
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        assigned_to: assigned_to || "",
        status_text: status_text || "",
        created_on: currentDateTime,
        updated_on: currentDateTime,
        open: true
      }

      let newIssueArrayObj = {
        name: project,
        issues: [newIssueObj]
      }

      if (!issue_title  || !issue_text || !created_by ) {
        res.json({ error: 'required field(s) missing' })
        return

      } else {
        IssueArrayModel
          .findOne({ name: project })
          .then( result => {
            if (!result) {
                let newIssueArray = new IssueArrayModel(newIssueArrayObj)
                newIssueArray
                  .save()
                  .then( savedArr => {
                    res.json(savedArr.issues[0])
                  })
            } else {
                result.issues.push(newIssueObj)
                result
                  .save() // <- mongoose knows ive pushed to"issues" on my document, and "save()" becomes "updateOne()"
                  .then( savedArr => {
                    let last = savedArr.issues.length - 1
                    res.json(savedArr.issues[last])
                  })
            }
          })
      }

    })
    
    .put(function (req, res){

      let project = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body

      if (!_id) {
        res.json({ error: 'missing _id' })
        return

      } else if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.json({ error: 'no update field(s) sent', '_id': _id })
        return

      } else {
        IssueArrayModel
          .findOne({ name: project })
          .then( result => {
            if (!result) {
              res.json({ error: 'could not update', '_id': _id })
              return
            } else {
              let issue = result.issues.id(_id)
              if (!issue) {
                res.json({ error: 'could not update', '_id': _id })
                return
              } else {
                issue.issue_title = issue_title || issue.issue_title
                issue.issue_text  = issue_text  || issue.issue_text
                issue.created_by  = created_by  || issue.created_by
                issue.assigned_to = assigned_to || issue.assigned_to
                issue.status_text = status_text || issue.status_text
                issue.updated_on  = new Date()
                issue.open = open || issue.open
                result
                  .save()
                  .then(res.json({  result: 'successfully updated', '_id': _id }))
              }
            }
          })
      }

    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body

      if (!_id) {
        res.json({ error: 'missing _id' })
        return
      } else {
        IssueArrayModel
          .findOne({ name: project })
          .then( result => {
            let issue = result.issues.id(_id)
            if (!issue) {
              res.json({ error: 'could not delete', '_id': _id })
              return
            } else {
              issue.deleteOne()
              result
                .save()
                .then(res.json({ result: 'successfully deleted', '_id': _id }))
            }
        })
      }
    });
    
};
