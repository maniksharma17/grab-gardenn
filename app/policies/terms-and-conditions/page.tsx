"use client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Terms and Conditions Section */}
      <section className="py-8 mt-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl max-md:text-2xl font-medium text-primary">
              Terms and Conditions
            </h1>
            <p className="text-gray-700 mt-4">Last updated on Mar 30, 2025</p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-gray-200 text-md text-gray-700">
            <p className="mb-6">
              For the purpose of these Terms and Conditions, the term <strong>&quot;we,&quot; &quot;us,&quot; &quot;our&quot;</strong> refers to <strong>GRAB GARDENN HEALTHY FOODS</strong>, whose registered/operational office is Grab Gardenn Healthy Foods, Khasra No. 96, Salempur Industrial Area, Haridwar, Uttarakhand 247667.
            </p>
            <p className="mb-6">
              The terms <strong>&quot;you,&quot; &ldquo;your,&rdquo; &quot;user,&quot; &ldquo;visitor&rdquo;</strong> refer to any natural or legal person visiting our website and/or purchasing from us.
            </p>

            <ul className="list-disc list-inside space-y-4">
              <li>The content of the pages of this website is subject to change without notice.</li>

              <li>
                Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found on this website for any particular purpose. 
                You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
              </li>

              <li>
                Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. 
                It is your responsibility to ensure that any products, services, or information available through our website meet your specific requirements.
              </li>

              <li>
                Our website contains material that is owned by or licensed to us, including but not limited to the design, layout, look, appearance, and graphics. 
                Reproduction is prohibited except in accordance with the copyright notice, which forms part of these terms and conditions.
              </li>

              <li>All trademarks reproduced on our website that are not our property or licensed to us are acknowledged on the website.</li>

              <li>Unauthorized use of information provided by us may result in a claim for damages and/or a criminal offense.</li>

              <li>From time to time, our website may include links to other websites. These links are provided for your convenience to offer additional information.</li>

              <li>
                You may not create a link to our website from another website or document without prior written consent from <strong>GRAB GARDENN HEALTHY FOODS</strong>.
              </li>

              <li>
                Any dispute arising out of the use of our website, purchases, or engagements with us is subject to the laws of India.
              </li>

              <li>
                We shall not be liable for any loss or damage arising directly or indirectly from the decline of authorization for any transaction due to the cardholder exceeding the preset limit agreed upon by us and our acquiring bank.
              </li>
            </ul>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant={"outline"}>Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditions;
