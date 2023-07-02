
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
        assigned_to: assigned_to,
        status_text: status_text,
        created_on: currentDateTime,
        updated_on: currentDateTime,
        open: true
      }

      let newIssueArrayObj = {
        name: project,
        issues: newIssueObj
      }

      if (newIssueObj.issue_title === "" || newIssueObj.issue_text === "" || newIssueObj.created_by === "") {
        res.json({ error: 'required field(s) missing' })
        return

      } else {
        IssueArrayModel
          .find({ name: project })
          .then( result => {
            if (result.length === 0) {
                let newIssueArray = new IssueArrayModel(newIssueArrayObj)
                newIssueArray.save()
            } else {
                let issueArr = result[0]
                issueArr.issues.push(newIssueObj)
                issueArr.save() // <- mongoose somehow knows ive pushed to"issues" on my document, and "save()" becomes "updateOne()"
                res.json(result[0])
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
