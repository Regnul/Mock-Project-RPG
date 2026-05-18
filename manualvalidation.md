# RPG Mock Testing Suite: Manaul Test Validation Report

I am interpreting manual here to mean those tests which I kept in my head as actions to keep repeating when automation seemed best kept for the other tasks. So these are not separate test results as much as a breakdown of where I focused my own efforts to make my use easier.

This is luckily very short as I was able to utilize playwright to automate what I wanted done and this is identical to me performing actions manually. There are only a few things outside the automated tests that I chose to do.

---

Browser Configuration Changes:

I had some trouble getting the game to appear as I hoped on the screen due to my large monitor and high resolution. I was able to get the scaling to be fully dynamic and reorganized the on screen elements to accomodate as much scaling as possible

What was tricky here was that I needed to re-test these changes myself at a few different steps to be sure that the underlying logic for the scaling was functional. What I settled on was a centered view that would allow zoom to some degree but did not really allow the game to move on the screen.

---

Login Step Testing

The default login info is so far the only allowable input. no input or wrong input will show an invalid message, but I am not sure how to make the good username and password visible enough and I decided refreshing the server through good and bad inputs was not worth doing as it would be much heavier than 
the other automated tests. So this is somewhat haphazard as far as fully testing the login procedure.

---

Playwright

This dependancy is extremely useful but the code behind it takes more time to go through than the actual game so far. Adding additional features or ordering other yet-to-be-implemented features makes this a hard substitute for real gameplay testing. but the e2e purpose was good.


comment**