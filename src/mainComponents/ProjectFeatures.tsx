import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TagVariant = "fe" | "be" | "admin" | "infra";

interface LineItem {
  name: string;
  components: string;
  scope: string;
  complexity: "Simple" | "Medium" | "Complex";
  charge: number;
  tag: TagVariant;
}

interface TotalRow {
  label: string;
  value: string;
  variant?: "default" | "discount" | "grand";
}

interface NoteBox {
  title: string;
  highlight?: boolean;
  content: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<TagVariant, string> = {
  fe: "bg-blue-50 text-blue-700",
  be: "bg-red-50 text-red-800",
  admin: "bg-purple-50 text-purple-800",
  infra: "bg-yellow-50 text-yellow-800",
};

const TAG_LABELS: Record<TagVariant, string> = {
  fe: "Frontend",
  be: "Backend",
  admin: "Admin",
  infra: "Infra",
};

const FRONTEND_ITEMS: LineItem[] = [
  {
    name: "Public Interface & Core Pages",
    components:
      "Home, AboutUs, ContactUs, SupportUs, GalleryPage, ViewAllAwards",
    scope: "Responsive layouts, intuitive navigation, and Foundation branding",
    complexity: "Medium",
    charge: 3500,
    tag: "fe",
  },
  {
    name: "Media & Gallery System",
    components: "GalleryPage, ViewPhotoId, ViewVideoId",
    scope: "Photo & video grids, detailed media view layouts",
    complexity: "Simple",
    charge: 2500,
    tag: "fe",
  },
  {
    name: "Community & Engagement",
    components: "SeeBlogs, BlogPostPage, VolunteerPage, WriteTestimonial",
    scope: "Blog feeds, volunteer applications, testimonial submission UI",
    complexity: "Medium",
    charge: 3000,
    tag: "fe",
  },
  {
    name: "Programs & Initiatives",
    components: "AdoptionForm, RescuePage, ViewAllRescue, Awards, ReportPage",
    scope: "Complex forms for adoption/rescue reporting, awards showcase",
    complexity: "Complex",
    charge: 3500,
    tag: "fe",
  },
  {
    name: "Admin Dashboards & Management UI",
    components:
      "NewDashAdmin, PhotoDash, VideoDash, RescueDash, AwardDash, BlogsDash",
    scope: "Secure admin portal, CRUD interfaces, statistics dashboards",
    complexity: "Complex",
    charge: 4000,
    tag: "admin",
  },
];

const BACKEND_ITEMS: LineItem[] = [
  {
    name: "Core System & Auth",
    components: "Admin Auth, JWT implementation, Category Management API",
    scope: "Role-based access, token management, core data categorization",
    complexity: "Medium",
    charge: 3000,
    tag: "be",
  },
  {
    name: "Content Management API",
    components: "Blogs API, Photos/Videos upload, Testimonial API",
    scope: "Image/Video cloud integration (Cloudinary), blog CRUD operations",
    complexity: "Medium",
    charge: 3000,
    tag: "be",
  },
  {
    name: "Operations & Impact API",
    components: "Rescue API, Adoption API, Awards API, Volunteers API",
    scope: "Complex multi-model relationships, form submissions processing",
    complexity: "Complex",
    charge: 4000,
    tag: "be",
  },
  {
    name: "Infrastructure & DevOps",
    components: "Deployment config, CORS, Database connection, Error Handling",
    scope: "Production environment setup, server hosting configuration",
    complexity: "Medium",
    charge: 3500,
    tag: "infra",
  },
];

const TOTALS: TotalRow[] = [
  { label: "Frontend Subtotal", value: "₹16,500" },
  { label: "Backend Subtotal", value: "₹13,500" },
  { label: "Gross Total", value: "₹30,000" },
  { label: "Grand Total", value: "₹30,000", variant: "grand" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Tag: React.FC<{ variant: TagVariant }> = ({ variant }) => (
  <span
    className={`inline-block font-bold px-1.5 py-0.5 rounded-sm mt-1 uppercase tracking-widest ${TAG_STYLES[variant]}`}
    style={{ fontSize: 9 }}
  >
    {TAG_LABELS[variant]}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className='flex items-center gap-2 border-b-2 border-green-600 uppercase font-bold text-green-600 tracking-widest'
    style={{ fontSize: 10, paddingTop: 24, paddingBottom: 12 }}
  >
    <span className='w-1.5 h-1.5 rounded-full bg-green-600 flex-shrink-0' />
    {children}
  </div>
);

const MetaItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "text-white" }) => (
  <div>
    <span
      className='block text-gray-500 uppercase tracking-widest mb-1'
      style={{ fontSize: 10 }}
    >
      {label}
    </span>
    <span className={`text-sm ${valueClass}`}>{value}</span>
  </div>
);

const ItemRow: React.FC<{ item: LineItem }> = ({ item }) => (
  <tr className='hover:bg-gray-50 transition-colors duration-150'>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top'
      style={{ width: "36%" }}
    >
      <div className='font-bold text-sm text-gray-900 pr-2'>{item.name}</div>
      <div className='text-xs text-gray-400 mt-0.5 leading-relaxed hidden sm:block'>
        {item.components}
      </div>
      <div className='text-xs text-gray-400 mt-0.5 leading-relaxed sm:hidden'>
        {item.components.length > 50
          ? item.components.substring(0, 50) + "..."
          : item.components}
      </div>
      <Tag variant={item.tag} />
    </td>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top hidden sm:table-cell'
      style={{ width: "28%" }}
    >
      <div className='text-xs text-gray-400 leading-relaxed'>{item.scope}</div>
    </td>
    <td className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top text-center'>
      <span
        className={`inline-block font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs ${
          item.complexity === "Simple"
            ? "bg-green-100 text-green-800"
            : item.complexity === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {item.complexity}
      </span>
    </td>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top text-right text-sm font-medium text-gray-900'
      style={{ fontFamily: "monospace" }}
    >
      ₹{item.charge.toLocaleString("en-IN")}
    </td>
  </tr>
);

const TABLE_HEADERS = ["Item", "Scope", "Complexity", "Amount"];

const TableSection: React.FC<{ title: string; items: LineItem[] }> = ({
  title,
  items,
}) => (
  <div className='px-4 sm:px-6 lg:px-12'>
    <SectionTitle>{title}</SectionTitle>
    <div className='overflow-x-auto -mx-4 sm:mx-0'>
      <table className='w-full border-collapse min-w-[600px]'>
        <thead>
          <tr>
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={h}
                className={`font-bold text-gray-400 border-b border-gray-200 px-2 py-3 uppercase tracking-widest ${
                  i === 0 || i === 1
                    ? "text-left"
                    : i === 2
                    ? "text-center"
                    : "text-right"
                } ${i === 1 ? "hidden sm:table-cell" : ""}`}
                style={{ fontSize: 10 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Copy Function ──────────────────────────────────────────────────────────────

const formatBillForCopy = () => {
  let billText = `PRAPTI FOUNDATION - PROJECT FEATURES\n`;
  billText += `================================\n\n`;

  // Frontend Section
  billText += `FRONTEND DEVELOPMENT\n`;
  billText += `-------------------\n`;
  FRONTEND_ITEMS.forEach((item) => {
    billText += `${item.name}\n`;
    billText += `  Components: ${item.components}\n`;
    billText += `  Scope: ${item.scope}\n`;
    billText += `  Complexity: ${item.complexity}\n`;
    billText += `  Charge: ₹${item.charge.toLocaleString("en-IN")}\n\n`;
  });

  // Backend Section
  billText += `BACKEND DEVELOPMENT\n`;
  billText += `------------------\n`;
  BACKEND_ITEMS.forEach((item) => {
    billText += `${item.name}\n`;
    billText += `  Components: ${item.components}\n`;
    billText += `  Scope: ${item.scope}\n`;
    billText += `  Complexity: ${item.complexity}\n`;
    billText += `  Charge: ₹${item.charge.toLocaleString("en-IN")}\n\n`;
  });

  // Totals
  billText += `TOTALS\n`;
  billText += `------\n`;
  TOTALS.forEach((row) => {
    billText += `${row.label}: ${row.value}\n`;
  });

  billText += `\nPayment Terms: 50% advance, 50% on delivery\n`;
  billText += `Generated: ${new Date().toLocaleDateString("en-IN")}\n`;

  return billText;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const NOTE_BOXES: NoteBox[] = [
  {
    title: "Payment Terms",
    highlight: true,
    content: (
      <p className='text-sm text-gray-600 leading-relaxed'>
        50% advance (₹15,000) before development start.
        <br />
        50% balance (₹15,000) on final delivery.
        <br />
        Payment via NEFT/UPI.
      </p>
    ),
  },
  {
    title: "What's Included",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Full Full-Stack codebase (MERN Stack)</li>
        <li>Deployed on Vercel + suitable backend platform</li>
        <li>Cloudinary image management</li>
        <li>Admin tracking and dashboard</li>
        <li>Bug support post-delivery</li>
      </ul>
    ),
  },
  {
    title: "Not Included",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Domain / hosting subscription fees</li>
        <li>Cloudinary or other paid service plan costs</li>
        <li>Future feature additions post-delivery</li>
        <li>Content creation / data entry</li>
      </ul>
    ),
  },
  {
    title: "Additional Services",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Payment Gateway Integration (Razorpay/Stripe)</li>
        <li>Advanced Analytics and SEO optimization</li>
        <li>Custom email system and bulk mailing</li>
      </ul>
    ),
  },
];

const ProjectFeatures: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyBill = async () => {
    const billText = formatBillForCopy();
    try {
      await navigator.clipboard.writeText(billText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy features:", err);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <>
    <div className='min-h-screen bg-gray-200 flex justify-center items-start py-6 sm:py-8 lg:py-10 px-3 sm:px-5 lg:px-5'>
      <div className='w-full max-w-4xl bg-white shadow-2xl rounded-lg sm:rounded-xl'>
        {/* ── Header ── */}
        <div className='bg-green-900 text-white px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-9 pb-4 sm:pb-6 lg:pb-7 relative overflow-hidden'>
          <div
            className='absolute rounded-full pointer-events-none'
            style={{
              right: -40,
              top: -40,
              width: 240,
              height: 240,
              border: "60px solid rgba(255,255,255,0.08)",
            }}
          />

          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start relative z-10 gap-4 sm:gap-0'>
            {/* Brand */}
            <div className='flex items-center gap-2 sm:gap-3'>
              <div
                className='w-8 h-8 sm:w-11 sm:h-11 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0'
                style={{ fontFamily: "Georgia, serif" }}
              >
                P
              </div>
              <div>
                <h1
                  className='text-lg sm:text-xl font-semibold tracking-wide text-white'
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  Prapti Foundation
                </h1>

                <span
                  className='text-green-200 font-bold uppercase tracking-widest'
                  style={{ fontSize: "9px" }}
                >
                  Non-Profit Organization Project
                </span>
              </div>
            </div>

            {/* Invoice label */}
                Project Features
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div
            className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-10 mt-6 sm:mt-7 pt-4 sm:pt-6 relative z-10'
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <MetaItem
              label='Issue Date'
              value={new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            />
            <MetaItem label='Valid Until' value='30 Days' />
            <MetaItem label='Project' value='Prapti Foundation Web' />
            <MetaItem label='Currency' value='INR (₹)' />
            <MetaItem
              label='Status'
              value='PROPOSED'
              valueClass='text-yellow-400'
            />
          </div>
        </div>

    
        <div
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200'
          style={{ gridTemplateColumns: "1fr 1px 1fr" }}
        >
          <div className='pr-0 lg:pr-6'>
            <p
              className='text-gray-400 uppercase tracking-widest mb-2.5'
              style={{ fontSize: 10 }}
            >
              Proposed By
            </p>
            <h3 className='text-base font-black mb-1.5 text-gray-900'>
              Himanku Borah and Ilish Hazarika
            </h3>
            <p className='text-sm text-gray-600 leading-7'>
              Full-Stack Developers
              <br />
              India
            </p>
            <div className='mt-4'>
              <h4 className='text-sm font-semibold text-gray-900'>
                Development Scope
              </h4>
              <p className='text-sm text-gray-600'>Complete Web Application</p>
            </div>
          </div>
          <div className='hidden lg:block bg-gray-200' />
          <div className='pl-0 lg:pl-6'>
            <p
              className='text-gray-400 uppercase tracking-widest mb-2.5'
              style={{ fontSize: 10 }}
            >
              Project Client
            </p>
            <h3 className='text-base font-black mb-1.5 text-gray-900'>
              Prapti Foundation
            </h3>
            <p className='text-sm text-gray-600 leading-7'>
              Non-Profit Organization
              <br />
              <br />
              Foundation web platform
            </p>
          </div>
        </div>

        {/* ── Line Item Tables ── */}
        <TableSection
          title='Frontend Development — React · TypeScript'
          items={FRONTEND_ITEMS}
        />
        <div className='mt-2'>
          <TableSection
            title='Backend Development — Node.js · Express · MongoDB'
            items={BACKEND_ITEMS}
          />
        </div>

        {/* ── Totals ── */}
        <div className='flex justify-end px-12 pb-8'>
          <div className='w-80 mt-2'>
            {TOTALS.map((row) =>
              row.variant === "grand" ? (
                <div
                  key={row.label}
                  className='flex justify-between items-center bg-green-900 text-white px-4 py-3.5 mt-2 rounded'
                >
                  <span
                    className='font-black uppercase tracking-wide'
                    style={{ fontSize: 11 }}
                  >
                    {row.label}
                  </span>
                  <span
                    className='text-green-300 font-bold'
                    style={{
                      fontFamily: "monospace",
                      fontSize: 20,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ) : (
                <div
                  key={row.label}
                  className='flex justify-between items-center py-2 border-b border-gray-100 text-sm'
                >
                  <span className='text-gray-600'>{row.label}</span>
                  <span
                    className={`font-medium ${
                      row.variant === "discount"
                        ? "text-green-700"
                        : "text-gray-800"
                    }`}
                    style={{ fontFamily: "monospace" }}
                  >
                    {row.value}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className='bg-gray-100 px-3 sm:px-4 py-3 flex justify-center border-b'>
          <button
            onClick={handleCopyBill}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200'
          >
            {copied ? (
              <>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                  />
                </svg>
                Copy Features for Review
              </>
            )}
          </button>
        </div>

        {/* ── Notes ── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8 mt-6'>
          {NOTE_BOXES.map((box: NoteBox) => (
            <div
              key={box.title}
              className={`bg-gray-50 p-4 sm:p-5 border-l-4 ${
                box.highlight ? "border-green-600" : "border-gray-300"
              }`}
            >
              <h4
                className='text-gray-400 font-bold uppercase tracking-widest mb-2'
                style={{ fontSize: 10 }}
              >
                {box.title}
              </h4>
              {box.content}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className='bg-green-900 text-green-500 px-4 sm:px-6 lg:px-12 py-4 sm:py-5 flex flex-col sm:flex-row justify-between items-center text-xs gap-2 sm:gap-0'>
          <div className='text-center sm:text-left text-green-100'>
            Project Features curated for{" "}
            <strong className='text-white'>Prapti Foundation</strong>
          </div>
          <div
            className='text-white uppercase tracking-widest text-center sm:text-right'
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 13,
              opacity: 0.15,
            }}
          >
            Prapti Foundation Web Application
          </div>
        </div>
 
   </>
  );
};

export default ProjectFeatures;
