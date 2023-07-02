
'use strict';
const IssueModel = require("../model-schemas").Issue
const IssueArrayModel = require("../model-schemas").IssueArray

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      IssueArrayModel
        .find({ name: project })
        .then( result => {

          if (result[0] !== undefined) {
            let issueArr = result[0].issues
            let filters = req.query

            // if filters = {}, for loop is omiited
            const filteredIssue = issueArr.filter( issue => {
              for (const key in filters) {
                if (issue[key] !== filters[key]) {
                  return false;
                }
              }
              return true
            })

          res.json(filteredIssue)
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
        issues: newIssueObj
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
                    console.log(savedArr.issues[0])
                    res.json(savedArr.issues[0])
                  })
            } else {
                result.issues.push(newIssueObj)
                result
                  .save() // <- mongoose knows ive pushed to"issues" on my document, and "save()" becomes "updateOne()"
                  .then( savedArr => {
                    let last = savedArr.issues.length - 1
                    console.log(savedArr.issues[last])
                    res.json(savedArr.issues[last])
                  })
            }
          })
      }

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
