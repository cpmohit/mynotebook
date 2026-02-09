const express = require('express');
const { body, validationResult } = require("express-validator"); // add validator package
const router = express.Router();
const Notes = require("../models/Notes");

const fetchuser = require("../middleware/fetchuser");

//Route-1 : Get all notes using: GET method /api/notes/getAllNotes  // Login required

router.get("/getAllNotes", fetchuser, async (req, res) => {
  
    try {
     //return res.status(200).send(req.user);
      
      const userId = req.user.id; 
     
      //return res.status(501).send(userId);
      // Check whether user id exist in db
      let notes = await Notes.find({id: userId}); // fetch record by id except password
     
      if (!notes) {
        return res
          .status(401)
          .json({ error: "Please try to login with correct login details." });
      }
  
      return res.status(200).send(notes);
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Somethng went wrong! Please try again later.");
    }
  });


// Route-2 : Create a notes using: POST "/api/auth". Require Auth

router.post(
    "/createNote", fetchuser,
    [
      body("title", "ENter a valid title must be at least 5 characters").isLength({ min: 5 }),
      body("description", "Description must be atleast 5 char ").isLength({ min: 5 })
    ],
    async (req, res) => {
      // If there are errors return Bad request and the errors
      const result = validationResult(req);
      
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      
      try {
        // handling try catch
  
        const {title, description, tag } = req.body;
        //return res.status(200).json(tag);
        // Check whether notes with this title exist
       
        let notes = await Notes.findOne({ title: req.body.title });
  
        if (notes) {
          return res.status(400).json({ error: "Notes already exist with this title." });
        }
        // Create a user into schema named User
        //return res.status(200).json(req.body);

        /*
        const notesObj = {
            title, description, tag, req.user.id
        }
        const saveJson = await notesObj.save();
        req.json(savejson);
        */

        notes = await Notes.create({
          user_id: req.user.id,
          title: req.body.title,
          description: req.body.description,
          tag: req.body.tag
        });
  
    
        res.status(200).json(notes);

      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      }
    }
  );

  // Route-3 : Update a notes using: PUT "/api/notes"  require Auth
router.put(
    "/updateNote/:id", fetchuser,
    // [
    //   body("title", "Enter a valid title must be at least 5 characters").isLength({ min: 5 }),
    //   body("description", "Description must be atleast 5 char ").isLength({ min: 5 })
    // ],
    async (req, res) => {
      // If there are errors return Bad request and the errors
      const result = validationResult(req);
      
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      
      try {
        // handling try catch
        
        const {title, description, tag } = req.body;
       
        // Check whether notes with this id exist
       
        let notes = await Notes.findById(req.params.id); // get the param url
       // return res.status(200).json(notes);
        
        if (!notes) {
          return res.status(404).json({ error: "Are you trying to update notes with incorrect notes id." });
        }

        if(notes.user_id.toString() !== req.user.id){
            return res.status(401).send("User not allowed for this action.")
        }

        const updateDataObj = {}

        if(title) {updateDataObj.title = title}
        if(description) {updateDataObj.description = description}
        if(tag) {updateDataObj.tag = tag}

        const note =await Notes.findByIdAndUpdate(req.params.id,{$set:updateDataObj}, {new:true})

        return res.status(200).json(note);
      
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      }
    }
  );


    // Route-4 : Update a notes using: PUT "/api/notes"  require Auth
    router.delete(
    "/deleteNote/:id", fetchuser,
    // [
    //   body("title", "Enter a valid title must be at least 5 characters").isLength({ min: 5 }),
    //   body("description", "Description must be atleast 5 char ").isLength({ min: 5 })
    // ],
    async (req, res) => {
      // If there are errors return Bad request and the errors
      const result = validationResult(req);
      
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      
      try {
        // handling try catch
      
        // Check whether notes with this id exist
       
        let notes = await Notes.findById(req.params.id); // get the param url
       // return res.status(200).json(notes);
        
        if (!notes) {
          return res.status(404).json({ error: "Are you trying to delete notes with incorrect notes id." });
        }

        if(notes.user_id.toString() !== req.user.id){
            return res.status(401).send("User not allowed for this action.")
        }

        const note =await Notes.findByIdAndDelete(req.params.id);

        return res.status(200).json({"message":"Notes id "+req.params.id+ " hab been delete successfully."});
      
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      }
    }
  );

module.exports = router;
