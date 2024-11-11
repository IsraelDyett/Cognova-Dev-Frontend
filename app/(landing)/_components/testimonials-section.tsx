import { cn } from "@/lib/utils";
import React from "react";

const featuredTestimonial = {
  body: "This AI chat solution has transformed how we handle customer support at Vercel. The ability to train it on our documentation and seamlessly integrate with WhatsApp Business has reduced our response time by 80%. The dashboard analytics and multi-channel support are exactly what modern businesses need.",
  author: {
    name: "Guillermo Rauch",
    handle: "rauchg",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW8GuAuK68jZCTGzQvjR68HdR-rYzs3TFaOQ&s",
    logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
  },
};

const testimonials = [
  [
    [
      {
        body: "Integrating this AI chat system into shadcn/ui's documentation was a game-changer. The embedded chat widget feels native, and the AI's understanding of our component library is impressive. It's like having a 24/7 technical support team.",
        author: {
          name: "shadcn",
          handle: "shadcn",
          imageUrl: "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        },
      },
    ],
    [
      {
        body: "The RAG implementation is brilliant. We uploaded our product catalog and documentation, and within hours, the AI was handling complex queries about our offerings. The WhatsApp integration has been a massive win for our international customers.",
        author: {
          name: "Lee Robinson",
          handle: "leeerob",
          imageUrl: "https://pbs.twimg.com/profile_images/1587647097670467584/adWRdqQ6_400x400.jpg",
        },
      },
    ],
  ],
  [
    [
      {
        body: "The pricing model is transparent and the ROI is clear. We've seen a 60% reduction in support tickets since implementing the AI chat solution. The ability to handle both technical and sales queries is remarkable.",
        author: {
          name: "Theo Browne",
          handle: "t3dotgg",
          imageUrl: "https://avatars.githubusercontent.com/u/6751787?v=4",
        },
      },
    ],
    [
      {
        body: "As someone who's built several SaaS products, this is the first AI chat solution that actually delivers on its promises. The dashboard analytics help us continuously improve our AI's responses, and the multi-channel support is seamless.",
        author: {
          name: "Hassan El Mghari",
          handle: "nutlope",
          imageUrl:
            "https://yt3.googleusercontent.com/6Uw8242vNIOvocmGUHAIGG41WgHVe9ElBM0nHOegY4qDxPKiytx8Et_cF4iPLy1c4XY81SQp=s900-c-k-c0x00ffffff-no-rj",
        },
      },
    ],
  ],
];

export default function TestimonialsSection() {
  return (
    <div id="testimonials">
      <svg
        className="absolute inset-0 -z-10 hidden h-full w-full stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)] sm:block"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="55d3d46d-692e-45f2-becd-d8bdc9344f45"
            width={200}
            height={200}
            x="50%"
            y={0}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={0} className="overflow-visible fill-gray-50">
          <path
            d="M-200.5 0h201v201h-201Z M599.5 0h201v201h-201Z M399.5 400h201v201h-201Z M-400.5 600h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#55d3d46d-692e-45f2-becd-d8bdc9344f45)"
        />
      </svg>
      <div className="relative">
        <div
          className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
          aria-hidden="true"
        >
          <div
            className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-8 opacity-25 blur-3xl xl:justify-end"
          aria-hidden="true"
        >
          <div
            className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="text-center">
          <h2 className="text-base font-semibold leading-7 text-primary pb-4">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            We have worked with thousands of amazing people
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure className="col-span-2 hidden sm:block sm:rounded-2xl sm:bg-white sm:shadow-lg sm:ring-1 sm:ring-gray-900/5 xl:col-start-2 xl:row-end-1">
            <blockquote className="p-12 text-xl font-semibold leading-8 tracking-tight text-gray-900">
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className="flex items-center gap-x-4 border-t border-gray-900/10 px-6 py-4">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={featuredTestimonial.author.imageUrl}
                alt=""
              />
              <div className="flex-auto">
                <div className="font-semibold">{featuredTestimonial.author.name}</div>
                <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
              </div>
              <img
                className="h-10 w-auto flex-none rounded-sm shadow-sm"
                src={featuredTestimonial.author.logoUrl}
                alt=""
              />
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={cn(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? "xl:row-span-2"
                      : "xl:row-start-1",
                    "space-y-8",
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                    >
                      <blockquote className="text-gray-900 line-clamp-4">
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className="mt-6 flex items-center gap-x-4">
                        <img
                          className="h-10 w-10 rounded-full bg-gray-50"
                          src={testimonial.author.imageUrl}
                          alt=""
                        />
                        <div>
                          <div className="font-semibold">{testimonial.author.name}</div>
                          <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
