import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/constant';
import { setSingleJob } from '../redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiUsers, FiMail, FiCalendar } from 'react-icons/fi';

const JobDescription = () => {
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }]
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  const renderListFromText = (text) => {
    if (!text || typeof text !== "string") return <span className="text-gray-500">Not specified</span>;

    return (
      <ul className="list-disc list-inside space-y-2 mt-1 pl-4">
        {text
          .split(/[\n•,-]+/)
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
      </ul>
    );
  };

  const InfoCard = ({ icon, title, value }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="p-2 bg-blue-100 rounded-full text-blue-600">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-gray-800 font-medium">{value || "Not specified"}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto my-10 bg-white p-8 shadow-sm rounded-xl border border-gray-100"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{singleJob?.title}</h1>
            <p className="text-lg text-gray-600 mt-1">{singleJob?.company?.name || "Company name not specified"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-blue-700 font-medium">
              {singleJob?.stipendType}
            </Badge>
            <Badge variant="secondary" className="text-green-700 font-medium">
              {singleJob?.jobMode}
            </Badge>
            <Badge variant="secondary" className="text-purple-700 font-medium">
              {singleJob?.jobType}
            </Badge>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          className="self-start md:self-center"
        >
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg px-8 py-4 text-lg font-semibold shadow-sm transition-all ${isApplied
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-200"
              }`}
          >
            {isApplied ? "Application Submitted" : "Apply Now"}
          </Button>
        </motion.div>
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <InfoCard 
          icon={<FiMapPin size={20} />} 
          title="Location" 
          value={singleJob?.location} 
        />
        <InfoCard 
          icon={<FiDollarSign size={20} />} 
          title="Salary" 
          value={singleJob?.salary} 
        />
        <InfoCard 
          icon={<FiClock size={20} />} 
          title="Duration" 
          value={singleJob?.duration ? `${singleJob.duration} months` : null} 
        />
        <InfoCard 
          icon={<FiUsers size={20} />} 
          title="Openings" 
          value={singleJob?.noOfOpening} 
        />
      </div>

      {/* Main Content */}
      <div className="mt-10 space-y-8">
        {/* Job Description */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {singleJob?.description || "No description provided"}
          </p>
        </section>

        {/* Requirements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Requirements</h2>
          {renderListFromText(singleJob?.requirements)}
        </section>

        {/* Responsibilities */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Responsibilities</h2>
          {renderListFromText(singleJob?.responsibilities)}
        </section>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(singleJob?.skills) ? singleJob.skills : (typeof singleJob?.skills === 'string' ? singleJob.skills.split(',') : [])).map((skill, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1 text-sm font-medium">
                {skill.trim()}
              </Badge>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Perks & Benefits</h2>
            {renderListFromText(singleJob?.perks)}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
            <div className="space-y-4">
              <InfoCard 
                icon={<FiUsers size={18} />} 
                title="Total Applicants" 
                value={singleJob?.applications?.length} 
              />
              {singleJob?.questions && typeof singleJob.questions === 'string' && singleJob.questions.trim() !== '' && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Application Questions</h4>
                  <p className="text-gray-800">{singleJob.questions}</p>
                </div>
              )}
              <InfoCard 
                icon={<FiMail size={18} />} 
                title="Contact" 
                value={singleJob?.alternateMobileNo} 
              />
              <InfoCard 
                icon={<FiCalendar size={18} />} 
                title="Posted Date" 
                value={singleJob?.createdAt?.split("T")[0]} 
              />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default JobDescription;