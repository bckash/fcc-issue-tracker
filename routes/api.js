
'use strict';
const IssueModel = require("../model-schemas").Issue
const IssueArrayModel = require("../model-schemas").IssueArray

module.exports = function (app) {
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;

      // IssueArrayModel
      //   .find({ name: project })
      //   .then( result => {
      //     console.log(result[0])
      //     res.json(result[0])
      //   })

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

      if (newIssueObj.issue_title === "" || newIssueObj.issue_txt === "" || newIssueObj.created_by === "") {
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
                // console.log(result[0])
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
