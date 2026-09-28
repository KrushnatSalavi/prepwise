import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechicons from "./DisplayTechicons";

function InterviewCard({
  interviewId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) {
  // Feedback lookup comes later in the tutorial
  const feedback = null as Feedback | null;
  const normalizedType = /mix/i.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96">
      <div className="card-interview">
        <div>
          <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover image"
            width={90}
            height={90}
            className="rounded-full object-cover size-[90px]"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="flex flex-row gap-5 mt-3">
            <div className="flex flex-row gap-2">
              <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechicons techStack={techstack} />

          <Link
            href={
              feedback
                ? `/interview/${interviewId}/feedback`
                : `/interview/${interviewId}`
            }
            className="btn-primary inline-flex items-center justify-center text-sm"
          >
            {feedback ? "Check Feedback" : "View Interview"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
