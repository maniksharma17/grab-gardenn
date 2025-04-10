"use client";


import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Heart,
  Globe,
  HandHeart,
  CircleCheck,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="bg-green-700 relative h-[200px] mt-12 w-full mx-auto text-center">
        <div className="absolute mt-6 inset-0  flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-4xl max-md:text-2xl font-bold text-primary-foreground mb-2">
            About Grab Gardenn
          </h2>
          <p className="md:w-1/2 mx-auto text-md max-md:text-sm text-muted">
            Founded with a passion for healthy living and sustainable practices,
            Grab Gardenn has been your trusted source for premium natural
            products since 2021.
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto md:py-2 px-0">
        {/* Our Story Section */}
        <section className="relative rounded-xl flex flex-col items-center md:gap-2 mb-4 md:mb-16">
          {/* Left Side - Text Content */}
          <div className="w-full md:w-1/2 md:space-y-4 space-y-2 p-6">
            <h3 className="md:text-3xl mb-4 text-xl font-medium text-gray-700">
              Our Story
            </h3>
            <p className="md:text-md text-sm text-primary border-l-4 pl-2 md:leading-relaxed italic">
              The greenery of the terraced fields, the beauty of the valleys and
              the fragrance of mountain soil – this is our identity.
            </p>

            <p className="md:text-lg text-sm md:leading-relaxed">
              When mountain women fill colors of their hard work in the fields &
              battles with all the weather conditions while protecting the crops
              from wild animals - Then the pure & natural products of “Grab
              Gardenn” are born.
            </p>

            <p className="md:text-lg text-sm md:leading-relaxed">
              This is not just a product, it is the hard work of the various
              mountain women & the gift of nature, which brings your home close
              to the mountains.
            </p>
          </div>

          {/* Right Side - Image */}
          <div className="px-4 md:w-1/2 relative">
            <Image
              src="https://grabgardenn-storage.s3.ap-south-1.amazonaws.com/images/IMG_5884.JPG"
              alt="Natural Farming"
              width={500}
              height={500}
              className="w-full object-cover rounded-xl"
            />
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="relative flex-col-reverse flex items-center md:gap-2 mb-4 md:mb-16">
          {/* Left Side - Image */}
          <div className="px-4 w-full md:w-1/2 relative">
            <Image
              src="hero/IMG_5858.JPG"
              alt="Natural Farming"
              width={500}
              height={500}
              className="w-full object-cover rounded-xl"
            />
          </div>

          {/* Right Side - Text Content */}
          <div className="w-full md:w-1/2 space-y-2 px-4 py-2">
            <h3 className="md:text-3xl mb-4 text-2xl font-medium text-gray-700">
              Our Mission
            </h3>
            <p className="md:text-lg text-sm md:leading-relaxed">
              Grab Gardenn makes natural living accessible, enjoyable, and
              sustainable for all.
            </p>

            <p className="md:text-lg text-sm text-muted-foreground leading-relaxed">
              We work directly with certified natural farmers and producers to
              bring you the finest products while supporting{" "}
              <strong>sustainable agricultural practices</strong>.
            </p>

            {/* Key Points */}
            <ul className="space-y-2">
              {[
                "Women Empowerment Schemes",
                "Direct farmer partnerships",
                "Eco-friendly packaging",
                "Community support programs",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CircleCheck className="text-primary w-4 h-4 md:w-6 md:h-6" />
                  <span className="md:text-lg text-sm text-gray-700">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Key Features */}
        <div className="md:w-1/2 mx-auto max-md:border-t p-4 flex flex-col gap-6 mb-4 md:mb-16">
          <h3 className="text-2xl md:text-3xl font-medium text-gray-700">
            Our Fundamentals
          </h3>
          {[
            {
              icon: Leaf,
              title: "100% Natural",
              desc: "We carefully select only the finest natural products, ensuring everything meets strict quality standards.",
            },
            {
              icon: Heart,
              title: "Health First",
              desc: "Your health is our priority. We believe in providing products that nourish both body and mind.",
            },
            {
              icon: Globe,
              title: "Sustainable Practices",
              desc: "We're committed to environmental sustainability in every aspect of our business.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="text-center p-4 bg-card rounded-lg shadow-md border"
            >
              <feature.icon
                strokeWidth={1}
                className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm md:text-md text-muted-foreground">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Our Team Section */}
        <section className="text-center px-4 pb-10 pt-6 bg-white">
  <h3 className="text-3xl max-md:text-2xl font-medium text-gray-700 mb-8">
    Our Team
  </h3>

  <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
    {/* Dr. Priya Saini */}
    <div className="md:w-1/2 bg-card rounded-2xl border shadow-md p-6 md:p-10 flex flex-col items-start gap-6">
      <Image
        src="team/cofounder1.jpeg"
        alt="Dr. Priya Saini"
        width={200}
        height={200}
        className="border-2 border-primary object-cover aspect-square rounded-full"
      />
      <div className="text-left">
        <h4 className="text-2xl font-semibold text-primary mb-1">
          Dr. Priya Saini
        </h4>
        <p className="text-muted-foreground mb-4">Co-Founder</p>
        <p className="text-sm text-gray-700 leading-relaxed max-w-prose">
          Dr. Priya Saini is a distinguished scholar and seasoned professional with a Ph.D. in Management from Doon University, Dehradun. Throughout her career, she has seamlessly blended her academic expertise with practical business experience, positioning herself as an influential figure in the realms of education and community service.
          <br /><br />
          Dr. Saini is particularly passionate about empowering women and fostering inclusive development through strategic initiatives. Her experience spans various sectors, equipping her with a versatile skill set that encompasses both theoretical and practical knowledge.
          <br /><br />
          Her core competencies include strategic planning, keen observation, and a commitment to learning and development. These attributes not only enhance her effectiveness as a leader but also enable her to uplift her team members. As a natural team maker, she fosters collaboration and synergy, ensuring that each member feels valued and motivated to contribute to the collective goals.
          <br /><br />
          Her dedication to community service is evident in her active involvement in programs aimed at uplifting future generations of leaders. She firmly believes that empowering females is essential for societal progress and economic development.
        </p>
      </div>
    </div>

    {/* Dr. Preeti Rana */}
    <div className="md:w-1/2 bg-card rounded-2xl border shadow-md p-6 md:p-10 flex flex-col items-start gap-6">
      <Image
        src="team/cofounder-2-image.jpeg"
        alt="Dr. Preeti Rana"
        width={200}
        height={200}
        className="border-2 border-primary aspect-square object-cover rounded-full"
      />
      <div className="text-left">
        <h4 className="text-2xl font-semibold text-primary mb-1">
          Dr. Preeti Rana
        </h4>
        <p className="text-muted-foreground mb-4">Co-Founder</p>
        <p className="text-sm text-gray-700 leading-relaxed max-w-prose">
          Dr. Preeti Rana, a doctorate in Management from Doon University, brings over a decade of experience in research and academia, specializing in Sustainable Supply Chain Management with a focus on SMEs in Uttarakhand. She has led impactful research projects funded by JICA and ICSSR and presented her work at prestigious platforms like IIM Kashipur and the University of State Fiscal Service of Ukraine, with publications in ABDC, Web of Science, and Scopus-indexed journals.
          <br /><br />
          After a successful academic career as an Assistant Professor and Research Head, she now takes a plunge into entrepreneurship with Grab Gardenn, aiming to empower women and local farmers by promoting Himalayan products.
          <br /><br />
          Dr. Rana is deeply dedicated to the empowerment of women and the upliftment of local farmers in the Uttarakhand Himalayas. She actively works towards creating opportunities for women to achieve financial independence and encourages sustainable agricultural practices that enhance the livelihoods of farmers.
          <br /><br />
          Her belief in collective progress is evident in her collaborative leadership style, ensuring that her team remains motivated, valued, and inspired.
          <br /><br />
          With a strong sense of purpose, Dr. Rana leads Grab Gardenn not just as a business, but as a platform for empowerment and community well-being. Her unwavering dedication to growing together with the local community reflects her belief that every milestone she achieves should also uplift those around her.
        </p>
      </div>
    </div>
  </div>
</section>


      </div>

      {/* Join Our Journey */}
      <div className="text-center border-t max-md:py-10 py-8 px-4">
        <h3 className="flex flex-row gap-2 items-center justify-center md:text-4xl text-2xl font-medium text-primary mb-4">
          <p>Join us!</p>
          <HandHeart />
        </h3>
        <p className="md:text-lg text-sm text-black mb-8 max-w-2xl mx-auto">
          Be part of our mission to promote healthy living and sustainable
          practices. Start your healthy journey with us today.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
          Shop Our Products
        </Button>
      </div>
    </div>
  );
}
