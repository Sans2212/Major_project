
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  HStack,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import ReactSelect from "react-select";
import countryList from "react-select-country-list";


const steps = [
  { title: "About You", description: "Enter your personal details" },
  { title: "Professional Background", description: "Your work experience" },
  { title: "Expertise", description: "Areas you can mentor in" },
  { title: "Motivation", description: "Why you want to be a mentor" },
];

const MentorApplicationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    profilePhoto: null,
    profilePhotoURL: "",
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    company: "",
    location: "",
    category: "",
    skills: "",
    bio: "",
    linkedin: "",
    twitter: "",
    website: "",
    introVideo: "",
  });

  const isMobile = useBreakpointValue({ base: true, md: false });
  const countryOptions = countryList().getData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: files[0],
        profilePhotoURL: files[0] ? URL.createObjectURL(files[0]) : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    const required = {
      0: ["profilePhoto", "firstName", "lastName", "email"],
      1: ["jobTitle", "company", "location"],
      2: ["category", "skills"],
      3: ["bio", "linkedin", "twitter", "website", "introVideo"],
    }[activeStep];

    if (required.some((f) => !formData[f])) {
      return alert("Please fill in all required fields before proceeding.");
    }
    if (activeStep === 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return alert("Please enter a valid email address.");
    }
    setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async () => {
    const toSend = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v !== null) toSend.append(k, v);
    });
  
    try {
      // Post form data to the backend
      await axios.post("http://localhost:3001/api/mentors/apply", toSend);
  
      alert("Application submitted successfully!");
      navigate("/mentor/done");
    } catch (err) {
      console.error("Error submitting application:", err.response || err);
      alert(err.response?.data?.error || "Failed to submit. Please try again.");
    }
  };
  
  return (
    <Box bg="#f7f9fc" minH="100vh" py={10} px={isMobile ? 4 : 16}>
      <Heading mb={4}>Apply to Become a Mentor</Heading>
      <Text mb={6}>
        Step {activeStep + 1} of {steps.length}: {steps[activeStep].title}
      </Text>

      <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
        <VStack spacing={5}>
          {activeStep === 0 && (
            <>
              <Input
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              {formData.profilePhotoURL && (
                <Text>
                  Uploaded:{" "}
                  <a
                    href={formData.profilePhotoURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.profilePhoto.name}
                  </a>
                </Text>
              )}
              <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </>
          )}

          {activeStep === 1 && (
            <>

              <Input
                name="jobTitle"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
              />
              <Input
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
              />
              <ReactSelect
                name="location"
                options={countryOptions}
                value={countryOptions.find(
                  (opt) => opt.value === formData.location
                )}
                onChange={(opt) =>
                  setFormData((p) => ({ ...p, location: opt.value }))
                }
              />

              <Box>
                <Text mb={1}>Job Title</Text>
                <Input
                  name="jobTitle"
                  placeholder="e.g., Software Engineer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>Company</Text>
                <Input
                  name="company"
                  placeholder="Where do you work?"
                  value={formData.company}
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Text mb={1}>country</Text>
                <ReactSelect
                  name="location"
                  options={countryOptions}
                  placeholder="Select your country"
                  value={countryOptions.find(
                    (option) => option.value === formData.location
                  )}
                  onChange={(selectedOption) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: selectedOption.value,
                    }))
                  }
                />
              </Box>

            </>
          )}

          {activeStep === 2 && (
            <>
              <Select
                name="category"
                placeholder="Select category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Engineering & Data</option>
                <option>UX & Design</option>
                <option>Business & Management</option>
                <option>Product & Marketing</option>
              </Select>
              <Input
                name="skills"
                placeholder="Skills (comma separated)"
                value={formData.skills}
                onChange={handleChange}
              />
            </>
          )}

          {activeStep === 3 && (
            <>
              <Textarea
                name="bio"
                placeholder="Short Bio"
                value={formData.bio}
                onChange={handleChange}
              />
              <Input
                name="linkedin"
                placeholder="LinkedIn URL"
                value={formData.linkedin}
                onChange={handleChange}
              />
              <Input
                name="twitter"
                placeholder="Twitter Handle"
                value={formData.twitter}
                onChange={handleChange}
              />
              <Input
                name="website"
                placeholder="Website URL"
                value={formData.website}
                onChange={handleChange}
              />
              <Input
                name="introVideo"
                placeholder="Intro Video URL"
                value={formData.introVideo}
                onChange={handleChange}
              />
            </>
          )}
        </VStack>

        <Divider my={6} />

        <HStack justify="space-between">
          {activeStep > 0 && (
            <Button onClick={handleBack} colorScheme="gray">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button onClick={handleNext} colorScheme="purple">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} colorScheme="green">
              Submit Application
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default MentorApplicationForm;
