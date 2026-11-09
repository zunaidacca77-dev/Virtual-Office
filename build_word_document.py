import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()
    
    # Page setup - Margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        
        # Header & Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("মাস্টার ভার্চুয়াল অফিস ব্লু-প্রিন্ট ও টেমপ্লেট গাইড v2.0")
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(128, 128, 128)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("ভার্চুয়াল অফিস সেটআপ ফ্রেমওয়ার্ক | ট্রেইনি ও ফ্রিল্যান্সারদের জন্য রেডি গাইড")
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(128, 128, 128)

    # Palette
    NAVY = RGBColor(15, 76, 129)       # #0F4C81 Classic Classic Deep Navy
    SECONDARY = RGBColor(43, 84, 126)   # #2B547E Steel Blue
    CHARCOAL = RGBColor(40, 40, 40)     # #282828 Body Text
    MUTED = RGBColor(100, 100, 100)
    WHITE = RGBColor(255, 255, 255)
    
    HEX_NAVY = "0F4C81"
    HEX_LIGHT_BG = "F4F7FA"
    HEX_BORDER = "CBD5E1"
    HEX_ALERT_BG = "FEF3C7"
    HEX_ALERT_BORDER = "F59E0B"
    HEX_SUCCESS_BG = "ECFDF5"
    HEX_SUCCESS_BORDER = "10B981"
    
    def set_font(run, font_name="Calibri", size_pt=11, bold=False, italic=False, color=CHARCOAL):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color
        
        # Set complex script font for Bengali
        rPr = run._r.get_or_add_rPr()
        fonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="Nirmala UI"/>')
        rPr.append(fonts)

    def add_styled_heading(text, level=1):
        p = doc.add_paragraph()
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        if level == 1:
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(6)
            set_font(run, font_name="Calibri", size_pt=16, bold=True, color=NAVY)
            # Add bottom border under Heading 1
            pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="8" w:space="4" w:color="{HEX_NAVY}"/></w:pBdr>')
            p._p.get_or_add_pPr().append(pBdr)
        elif level == 2:
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(4)
            set_font(run, font_name="Calibri", size_pt=13, bold=True, color=SECONDARY)
        elif level == 3:
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            set_font(run, font_name="Calibri", size_pt=11.5, bold=True, color=CHARCOAL)
        return p

    def add_body_paragraph(text, bold_prefix="", italic=False, bullet=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        if bullet:
            p.paragraph_format.left_indent = Inches(0.25)
            brun = p.add_run("• ")
            set_font(brun, size_pt=10.5, bold=True, color=NAVY)
        if bold_prefix:
            run_b = p.add_run(bold_prefix)
            set_font(run_b, size_pt=11, bold=True, color=CHARCOAL)
        if text:
            run_t = p.add_run(text)
            set_font(run_t, size_pt=11, italic=italic, color=CHARCOAL)
        return p

    def add_callout(text, title="", alert_type="info"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.5)
        
        bg_color = HEX_LIGHT_BG
        border_color = HEX_NAVY
        if alert_type == "warning":
            bg_color = HEX_ALERT_BG
            border_color = HEX_ALERT_BORDER
        elif alert_type == "success":
            bg_color = HEX_SUCCESS_BG
            border_color = HEX_SUCCESS_BORDER
            
        tcPr = cell._tc.get_or_add_tcPr()
        # Shading
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
        tcPr.append(shd)
        # Left thick border, none for others
        tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
                              f'<w:top w:val="none"/>'
                              f'<w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/>'
                              f'<w:bottom w:val="none"/>'
                              f'<w:right w:val="none"/>'
                              f'</w:tcBorders>')
        tcPr.append(tcBorders)
        
        # Margins (top, bottom, left, right in dxa)
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                          f'<w:top w:w="120" w:type="dxa"/>'
                          f'<w:left w:w="180" w:type="dxa"/>'
                          f'<w:bottom w:w="120" w:type="dxa"/>'
                          f'<w:right w:w="180" w:type="dxa"/>'
                          f'</w:tcMar>')
        tcPr.append(tcMar)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(2)
        cp.paragraph_format.space_after = Pt(2)
        cp.paragraph_format.line_spacing = 1.15
        if title:
            trun = cp.add_run(title + "\n")
            set_font(trun, size_pt=10.5, bold=True, color=NAVY if alert_type!="warning" else RGBColor(180, 83, 9))
        crun = cp.add_run(text)
        set_font(crun, size_pt=10, italic=(alert_type=="info"), color=CHARCOAL)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def style_table(table, col_widths, headers, data):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].width = Inches(col_widths[i])
            hp = hdr_cells[i].paragraphs[0]
            hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            hp.paragraph_format.space_before = Pt(4)
            hp.paragraph_format.space_after = Pt(4)
            hrun = hp.add_run(header_text)
            set_font(hrun, size_pt=10, bold=True, color=WHITE)
            
            # Header cell background
            tcPr = hdr_cells[i]._tc.get_or_add_tcPr()
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{HEX_NAVY}"/>')
            tcPr.append(shd)
            
        # Data Rows
        for r_idx, row_data in enumerate(data):
            row_cells = table.rows[r_idx + 1].cells
            bg_col = "FFFFFF" if r_idx % 2 == 0 else HEX_LIGHT_BG
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].width = Inches(col_widths[c_idx])
                cp = row_cells[c_idx].paragraphs[0]
                cp.paragraph_format.space_before = Pt(3)
                cp.paragraph_format.space_after = Pt(3)
                cp.paragraph_format.line_spacing = 1.15
                crun = cp.add_run(cell_value)
                set_font(crun, size_pt=9.5, color=CHARCOAL)
                
                tcPr = row_cells[c_idx]._tc.get_or_add_tcPr()
                shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_col}"/>')
                tcPr.append(shd)
                
        # Set Table Borders (clean light border)
        tblPr = table._tbl.tblPr
        tblBorders = parse_xml(f'<w:tblBorders {nsdecls("w")}>'
                               f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>'
                               f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{HEX_NAVY}"/>'
                               f'<w:left w:val="none"/>'
                               f'<w:right w:val="none"/>'
                               f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER}"/>'
                               f'<w:insideV w:val="none"/>'
                               f'</w:tblBorders>')
        tblPr.append(tblBorders)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ------------------ DOCUMENT CONTENT ------------------

    # Document Header / Title
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    run_t = title_p.add_run("মাস্টার ভার্চুয়াল অফিস ব্লু-প্রিন্ট ও টেমপ্লেট গাইড")
    set_font(run_t, size_pt=22, bold=True, color=NAVY)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(6)
    run_s = sub_p.add_run("Master Virtual Office Blueprint & Template Structure (v2.0 - সংশোধিত ও পূর্ণাঙ্গ সংস্করণ)")
    set_font(run_s, size_pt=12, bold=True, color=SECONDARY)

    tag_p = doc.add_paragraph()
    tag_p.paragraph_format.space_after = Pt(12)
    run_tag = tag_p.add_run("Notion, Framer বা Google Sites-এ ১-ক্লিকে ট্রেইনিদের ভার্চুয়াল অফিস তৈরির রেডিমেড লেআউট, ফ্রন্টডেস্ক, সিকিউর পোর্টাল ও প্রম্পট চেকলিস্ট")
    set_font(run_tag, size_pt=10.5, italic=True, color=MUTED)

    # Trainer's Main Directive
    add_callout(
        "এই ব্লু-প্রিন্টটি অনুসরণ করে Notion-এ মাত্র ১টি মাস্টার টেমপ্লেট তৈরি করুন এবং 'Duplicate' অপশন অন করে ট্রেইনিদের সাথে শেয়ার করুন। প্রতিটি ট্রেইনি টেমপ্লেটটি নিজেদের অ্যাকাউন্টে ক্লোন করে শুধু নিজেদের নাম, স্কিল, হোয়াটসঅ্যাপ ও পেমেন্ট লিংক বসিয়ে নিলেই তাদের নিজস্ব অফিস রেডি হয়ে যাবে।",
        "🎯 প্রশিক্ষকের জন্য মাস্টার নির্দেশনা (Trainer's Action Guideline):",
        "info"
    )

    # ==================== PART 1 ====================
    add_styled_heading("অংশ ১: মাস্টার ভার্চুয়াল অফিস আর্কিটেকচার (Blueprint Sections)", level=1)
    
    # Section 1
    add_styled_heading("সেকশন ১: রিসেপশন ও ওয়েলকাম জোন (Top Header Section)", level=2)
    add_body_paragraph("একটি আধুনিক মিনিমালিস্ট অফিস বা প্রফেশনাল ওয়ার্কস্টেশনের কভার ব্যানার (Canva দিয়ে ১৮০০×৬০০ সাইজে ডিজাইন করা)।", "• অফিস ব্যানার (Cover Image): ")
    add_body_paragraph("Welcome to [Trainee Name]'s Virtual Office & Digital Studio", "• ট্রেইনির প্রোফাইল ও হেডলাইন: ")
    add_body_paragraph("🟢 Office Status: Online (Available for Instant Meeting) অথবা 🔴 In a Deep Work Session (Leave a message with my AI Receptionist / WhatsApp)। ট্রেইনি যখন কাজ করবেন তখন এটি গ্রিন রাখবেন, কাজের বাইরে গেলে রেড করবেন।", "• লাইভ স্ট্যাটাস ইন্ডিকেটর: ")
    add_body_paragraph("আমি [কাজের নাম, যেমন: Digital Marketing / Graphic Design / Web Development] এক্সপার্ট। নিচের যেকোনো সার্ভিস বা প্রজেক্ট নিয়ে সরাসরি আমার সাথে কথা বলুন।", "• সংক্ষিপ্ত পরিচিতি (১-২ লাইনে): ")

    # Section 2
    add_styled_heading("সেকশন ২: ইনস্ট্যান্ট মিটিং ও এআই ফ্রন্টডেস্ক (Live Lounge - সংশোধিত হাইব্রিড মডেল)", level=2)
    add_callout(
        "টেকনিক্যাল সংশোধন নোট: Notion ফ্রি পেজে কাস্টম JavaScript কোড সরাসরি রান করে না। তাই Tawk.to-এর সাধারণ উইজেট কোড নোশনে চলবে না। এর নিখুঁত সমাধান হিসেবে বামে Whereby ও Cal.com এবং ডানে Chatbase / Tally আইফ্রেমের সাথে একটি '১-ক্লিক ডিরেক্ট হোয়াটসঅ্যাপ কানেক্ট' বাটন রাখা হয়েছে, যা মোবাইল ও ডেস্কটপ সব ডিভাইসেই ১০০% কাজ করে।",
        "💡 টেকনিক্যাল আপডেট (Section 2 Revision):",
        "info"
    )

    # 2 Column layout table for section 2
    sec2_table = doc.add_table(rows=2, cols=2)
    sec2_headers = ["বাম পাশের বক্স: Direct Meeting Room (লাইভ লাউঞ্জ)", "ডান পাশের বক্স: 24/7 AI Desk & Quick Connect (ফ্রন্টডেস্ক)"]
    sec2_data = [[
        "📹 Enter My Virtual Cabin (ভিডিও/অডিও রুম):\n"
        "আমি ডেস্কে অনলাইন থাকলে সরাসরি কথা বলতে রুমে নক করুন।\n"
        "• বাটন ১: [ 🚪 Knock & Enter Live Room ]\n"
        "  (Whereby.com-এর ফ্রি স্থায়ী পার্সোনাল রুম লিংক)\n"
        "• বাটন ২: [ 📅 Schedule a Strategy Meeting ]\n"
        "  (Cal.com বা Calendly-এর ফ্রি বুকিং লিংক)",
        
        "🤖 Talk to My AI Assistant (তাৎক্ষণিক তথ্য):\n"
        "প্রাইসিং বা কাজের নিয়মের জন্য চ্যাটবট এম্বেড থাকবে।\n"
        "• এম্বেড ১: Chatbase / Tally আইফ্রেম উইজেট।\n\n"
        "📲 Direct WhatsApp Quick Desk (ব্যাকআপ):\n"
        "• বাটন: [ ⚡ Chat Directly on WhatsApp ]\n"
        "  (প্রি-ফিল্ড মেসেজ সহ wa.me ডিরেক্ট লিংক, যা কখনো ফেইল করে না)"
    ]]
    style_table(sec2_table, [3.2, 3.3], sec2_headers, sec2_data)

    # Section 3
    add_styled_heading("সেকশন ৩: সার্ভিস ক্যাটালগ ও পোর্টফোলিও শোকেস (The Showroom)", level=2)
    add_body_paragraph("সার্ভিসের নাম, কী কী ডেলিভারি পাবে, কত দিন সময় লাগবে এবং ফিক্সড প্রাইস (যেমন: $50 / ৳৫,০০০)।", "• প্যাকেজ ১ (Starter / Basic): ")
    add_body_paragraph("সার্ভিসের বিস্তারিত ফিচার, ডেলিভারি টাইমলাইন ও প্রাইস (যেমন: $150 / ৳১৫,০০০)।", "• প্যাকেজ ২ (Standard / Pro): ")
    add_body_paragraph("'আপনার প্রজেক্টের রিকোয়ারমেন্ট কি আলাদা? উপরে মিটিং রুমে সরাসরি কথা বলুন বা নিচে কাস্টম ফর্ম পূরণ করুন।'", "• প্যাকেজ ৩ (Custom / Enterprise Project): ")
    add_body_paragraph("নিচে ৪ থেকে ৬টি সেরা কাজের ছবি, কেস স্টাডি বা লাইভ লিংক Notion Gallery View বা গ্রিড কার্ড আকারে সাজানো থাকবে।", "• Recent Works (পোর্টফোলিও গ্যালারি): ")

    # Section 4
    add_styled_heading("সেকশন ৪: প্রজেক্ট অনবোর্ডিং ও অর্ডার জোন (Start a Project Desk)", level=2)
    add_body_paragraph("📝 Submit Your Project Requirements", "• সেকশন হেডিং: ")
    add_body_paragraph("Tally.so (সম্পূর্ণ ফ্রি ফর্ম বিল্ডার) দিয়ে তৈরি ফর্ম সরাসরি নোশন পেজের ভেতরে `/embed` কমান্ড দিয়ে এমবেড থাকবে।", "• ব্যবহৃত টুল: ")
    add_body_paragraph("১) Client Name & Email / WhatsApp Number, ২) Select Service Package (ড্রপডাউন), ৩) Project Brief / Instructions (বিস্তারিত লেখার বক্স), ৪) Upload Reference Files / Logo, ৫) [ 🚀 Submit Project & Proceed to Payment ] বাটন।", "• ফর্মের ফিল্ডসমূহ: ")
    add_body_paragraph("Tally ফর্মে ক্লায়েন্ট ডাটা সাবমিট করার সাথে সাথেই তা স্বয়ংক্রিয়ভাবে নোশন মাস্টার ডাটাবেজে নতুন রো হিসেবে জমা হয়ে যাবে।", "• অটোমেশন সুবিধা: ")

    # Section 5
    add_styled_heading("সেকশন ৫: ক্যাশ কাউন্টার বা পেমেন্ট জোন (Billing & Invoice Desk)", level=2)
    add_body_paragraph("💳 Official Payment & Billing Counter", "• সেকশন হেডিং: ")
    add_body_paragraph("[ 🌐 Pay via Payoneer / Wise Invoice ] বাটন অথবা সরাসরি কার্ড পেমেন্ট গেটওয়ে। (বাংলাদেশি ফ্রিল্যান্সারদের জন্য Payoneer Payment Request লিংক সবচেয়ে নির্ভরযোগ্য)।", "• অপশন ১ - International Clients: ")
    add_body_paragraph("ট্রেইনির বিকাশ ও নগদ পার্সোনাল/মার্চেন্ট নাম্বার এবং QR Code দেওয়া থাকবে। নিচে ট্রানজেকশন আইডি (TrxID) ইনপুট দেওয়ার ছোট বক্স থাকবে।", "• অপশন ২ - Local Clients (bKash / Nagad / Bank): ")

    # Section 6 (With Security Revision)
    add_styled_heading("সেকশন ৬: সুরক্ষিত ক্লায়েন্ট ডেলিভারি গেটওয়ে (Secure VIP Client Portal - সংশোধিত)", level=2)
    add_callout(
        "⚠️ সিকিউরিটি ও প্রাইভেসি সংশোধন (Critical Privacy Fix):\n"
        "Notion-এর একটি পাবলিক পেজের ভেতর ক্লায়েন্টদের সাব-পেজ রাখলে তা স্বয়ংক্রিয়ভাবে পাবলিক হয়ে যায়। ফলে ক্লায়েন্ট A ঢুকলে ক্লায়েন্ট B-এর গোপন ফাইল বা Google Drive লিংক দেখে ফেলার ঝুঁকি থাকে।\n"
        "সমাধান: পাবলিক পেজে ক্লায়েন্ট পোর্টালগুলোর কোনো সরাসরি সাব-পেজ লিংক থাকবে না। পাবলিক পেজে থাকবে একটি 'সিকিউর গেটওয়ে নোটিস' এবং ট্রেইনি তার নিজস্ব নোশনে সম্পূর্ণ আলাদা 'প্রাইভেট ডাটাবেজ' রেখে প্রতিটি ক্লায়েন্টকে গোপনে পার্সোনাল লিংক পাঠাবেন।",
        "🔒 প্রাইভেসি ও সিকিউরিটি আর্কিটেকচার:",
        "warning"
    )
    add_body_paragraph("📂 Secure Client Delivery & Verification Gateway", "• পাবলিক পেজে হেডিং: ")
    add_body_paragraph("'ক্লায়েন্টদের গোপনীয়তা ও এনডিএ (NDA) রক্ষা করতে প্রতিটি ক্লায়েন্টকে কাজ শুরুর সময় ইমেইল বা হোয়াটসঅ্যাপে একটি ব্যক্তিগত পাসওয়ার্ড-প্রটেক্টেড পোর্টাল লিংক প্রদান করা হয়।'", "• ক্লায়েন্ট প্রাইভেসি নোটিস: ")
    add_body_paragraph("যদি কোনো ক্লায়েন্টের লিংক হারিয়ে যায়, তবে সে সরাসরি WhatsApp বা Tally টিকিটের মাধ্যমে স্ট্যাটাস চাইতে পারবে।", "• রানিং ক্লায়েন্ট অ্যাকশন বাটন: ")
    add_body_paragraph("ট্রেইনি তার নোশনের মূল প্রাইভেট স্পেসে 'Client VIP Portals' নামে একটি আনপাবলিশড পেজ রাখবেন। প্রতিটি ক্লায়েন্টের জন্য আলাদা পেজ বানিয়ে শুধুমাত্র ওই ক্লায়েন্টের ইমেইলে ভিউ পারমিশন শেয়ার করবেন। এতে ক্লায়েন্টদের ফাইল ১০০% সুরক্ষিত থাকবে।", "• ব্যাকএন্ড সেটআপ নিয়ম: ")

    # Bonus 1
    add_styled_heading("বোনাস ১: এআই রিসেপশনিস্টের জন্য অপ্টিমাইজড সিস্টেম প্রম্পট (System Prompt)", level=2)
    add_callout(
        "\"You are the official AI Receptionist for [Trainee Name]'s Virtual Office. [Trainee Name] is a professional [Skill Name, e.g., Web Designer / Digital Marketer]. Your job is to warmly welcome clients who visit this virtual office.\n\n"
        "Follow these rules strictly:\n"
        "1. Greet them politely and ask what kind of project they need help with.\n"
        "2. Tell them about our service packages: Basic ($X), Standard ($Y), and Custom.\n"
        "3. If they want to talk live right now, ask them to click the 'Enter Live Room' button or schedule a call via the calendar.\n"
        "4. If [Trainee Name] is offline, collect the client's Name, WhatsApp/Email, and Project Budget so [Trainee Name] can reach out within 15 minutes.\n"
        "5. Always remain professional, concise, and helpful. Respond in Bengali if the client speaks Bengali, otherwise respond in English.\"",
        "🤖 Chatbase / Tally / Custom GPT-তে কপি করার প্রম্পট:",
        "info"
    )

    # Bonus 2 - 5 Tools Table
    add_styled_heading("বোনাস ২: মাত্র ৫টি ফ্রি টুল দিয়ে সম্পূর্ণ সেটআপ (ট্রেইনিদের চেকলিস্ট)", level=2)
    tools_table = doc.add_table(rows=6, cols=3)
    tools_headers = ["টুলের নাম (Tool)", "খরচ (Cost)", "ভার্চুয়াল অফিসে এটির কাজ"]
    tools_data = [
        ["1. Notion.so", "১০০% ফ্রি", "মূল ভার্চুয়াল অফিস ও অভ্যন্তরীণ প্রাইভেট ক্লায়েন্ট পোর্টাল বানানোর জন্য"],
        ["2. Whereby.com", "১০০% ফ্রি", "১-ক্লিকে কোনো সাইন-আপ ছাড়াই ব্রাউজারে ডিরেক্ট ভিডিও/অডিও মিটিং রুমের জন্য"],
        ["3. WhatsApp Quick Connect / Tally", "১০০% ফ্রি", "২৪/৭ ক্লায়েন্ট কমিউনিকেশন ও লিড সংগ্রহের জন্য (Chatbase-এর স্থায়ী বিকল্প)"],
        ["4. Tally.so", "১০০% ফ্রি (Unlimited)", "প্রজেক্ট রিকোয়ারমেন্ট অনবোর্ডিং ফর্ম ও নোশন অটো-সিঙ্কের জন্য"],
        ["5. Cal.com / Calendly", "১০০% ফ্রি", "টাইমজোন অনুযায়ী অটোমেটেড অ্যাপয়েন্টমেন্ট ও শিডিউল বুকিংয়ের জন্য"]
    ]
    style_table(tools_table, [1.8, 1.4, 3.3], tools_headers, tools_data)

    # ==================== PART 2 ====================
    doc.add_page_break()
    
    add_styled_heading("অংশ ২: ট্রেইনিদের জন্য রেডি-টু-ইউজ পেজ কনটেন্ট (Ready Page Content)", level=1)
    add_callout(
        "ট্রেইনিদের জন্য ব্যবহার বিধি: নিচে দেওয়া টেক্সটগুলো হুবহু কপি করে আপনার Notion পেজে পেস্ট করুন। যেখানে যেখানে ব্র্যাকেট [...] দেওয়া আছে, সেখানে আপনার নিজের নাম, স্কিল, হোয়াটসঅ্যাপ নাম্বার ও লিংকগুলো বসিয়ে দিন।",
        "📋 কপি-পেস্ট টেমপ্লেট গাইড:",
        "success"
    )

    # Page Content Start
    add_styled_heading("🌐 [আপনার নাম]-এর ডিজিটাল ভার্চুয়াল অফিস ও স্টুডিও", level=2)
    add_body_paragraph("(Notion Cover: Canva দিয়ে তৈরি প্রফেশনাল ব্যানার আপলোড করুন)", italic=True)
    
    add_body_paragraph("🟢 Active at Desk (সরাসরি মিটিংয়ে প্রবেশ করতে পারেন)\n[নোট: যখন কাজে থাকবেন তখন গ্রিন রাখবেন, ব্যস্ত থাকলে লিখবেন: 🔴 In a Deep Work Session - হোয়াটসঅ্যাপ বা ফর্মে মেসেজ রাখুন]", "• লাইভ অফিস স্ট্যাটাস: ")
    add_body_paragraph("\"স্বাগতম! আমি [আপনার নাম], একজন প্রফেশনাল [আপনার স্কিল, যেমন: UI/UX Designer / Digital Marketer]। কাজের গুণগত মান এবং সময়মতো প্রজেক্ট ডেলিভারি নিশ্চিত করতে এই ভার্চুয়াল অফিস থেকে আমি সরাসরি ক্লায়েন্টদের সাথে যুক্ত থাকি। নিচে আমার সার্ভিস ক্যাটালগ দেখুন অথবা সরাসরি আমার সাথে কথা বলুন।\"", "• পরিচিতি ও ভ্যালু প্রপোজিশন: ", italic=True)

    add_styled_heading("🚪 লাইভ লাউঞ্জ ও এআই ফ্রন্টডেস্ক (Live Meeting & Instant Desk)", level=3)
    add_body_paragraph("(Notion Tip: নিচে ২টি কলাম তৈরি করতে /2 columns কমান্ড দিন)", italic=True)
    
    p_cabin = doc.add_paragraph()
    set_font(p_cabin.add_run("👈 [কলাম ১: ডিরেক্ট মিটিং ক্যাবিন]\n"), bold=True, color=NAVY)
    set_font(p_cabin.add_run("📹 Enter My Virtual Cabin (সরাসরি ভিডিও/অডিও মিটিং)\n"
                           "আমি যদি স্ট্যাটাসে 🟢 Online থাকি, তবে কোনো অ্যাপ ছাড়াই ব্রাউজার থেকে সরাসরি আমার রুমে নক করুন।\n"
                           "• বাটন ১: [ 🚪 Knock & Enter Live Room ]  (Whereby.com/your-room লিংক যুক্ত করুন)\n"
                           "• বাটন ২: [ 📅 Schedule a Strategy Call ]  (Cal.com বা Calendly লিংক এম্বেড করুন)\n\n"))
    
    set_font(p_cabin.add_run("👉 [কলাম ২: এআই ফ্রন্টডেস্ক ও হোয়াটসঅ্যাপ]\n"), bold=True, color=NAVY)
    set_font(p_cabin.add_run("🤖 Talk to My AI Assistant (তাৎক্ষণিক তথ্য):\n"
                           "প্রাইসিং বা কাজের নিয়মের জন্য চ্যাটবট এম্বেড থাকবে। (/embed দিয়ে Chatbase বা Tally লিংক বসান)\n"
                           "• কুইক ব্যাকআপ বাটন: [ ⚡ Chat Directly on WhatsApp ]\n"
                           "  (লিংক: https://wa.me/8801XXXXXXXXX?text=Hi%20[আপনার%20নাম],%20I%20am%20at%20your%20Virtual%20Office%20and%20want%20to%20discuss%20a%20project)\n"))

    add_styled_heading("🛍️ সার্ভিস ক্যাটালগ ও প্যাকেজ (The Showroom)", level=3)
    pkg_table = doc.add_table(rows=4, cols=3)
    pkg_headers = ["🥉 Starter / Basic Desk", "🥈 Standard / Growth Pro", "🥇 Enterprise / Custom"]
    pkg_data = [
        ["মূল্য: $50 / ৳৫,০০০\nডেলিভারি: ২-৩ দিন", "মূল্য: $150 / ৳১৫,০০০\nডেলিভারি: ৫-৭ দিন", "মূল্য: কাস্টম কোটেশন\nডেলিভারি: প্রজেক্ট ভিত্তিক"],
        ["• সার্ভিস ফিচার ১\n• সার্ভিস ফিচার ২\n• সোর্স ফাইল অন্তর্ভুক্ত\n• ১টি রিভিশন", "• স্ট্যান্ডার্ড সব ফিচার\n• ফুল প্রজেক্ট সেটআপ\n• হাই-স্পিড সাপোর্ট\n• আনলিমিটেড রিভিশন", "• লার্জ স্কেল বিজনেস সলিউশন\n• ফুল-টিম সাপোর্ট\n• ডেডিকেটেড ম্যানেজার\n• মান্থলি মেইনটেন্যান্স"],
        ["👉 [ অর্ডার করতে নিচে যান ]", "👉 [ অর্ডার করতে নিচে যান ]", "👉 [ মিটিং রুমে নক করুন ]"]
    ]
    style_table(pkg_table, [2.1, 2.2, 2.2], pkg_headers, pkg_data)

    add_styled_heading("📝 প্রজেক্ট অনবোর্ডিং ডেস্ক (Submit Your Project)", level=3)
    add_body_paragraph("আপনার প্রজেক্টের ফাইল, বিবরণ ও লক্ষ্য নিচে সাবমিট করুন। সাবমিট করার সাথে সাথেই আমার নোশন ডাটাবেজে আপনার প্রজেক্ট ফাইল তৈরি হয়ে যাবে।", "• হেডিং ও নির্দেশনা: ")
    add_body_paragraph("(Notion-এ /embed কমান্ড দিয়ে আপনার Tally.so অনবোর্ডিং ফর্মটি এখানে এম্বেড করে দিন)", italic=True)

    add_styled_heading("💳 অফিসিয়াল ক্যাশ কাউন্টার ও পেমেন্ট ডেস্ক (Billing & Invoice)", level=3)
    add_body_paragraph("কাজ শুরু করার জন্য অগ্রিম পেমেন্ট বা ইনভয়েস ক্লিয়ার করতে নিচের মাধ্যমগুলো ব্যবহার করুন।", "• হেডিং: ")
    add_body_paragraph("Payoneer Payment Request / Wise Invoice Link ([ 🌐 Pay via International Card/Bank ] বাটন)", "• আন্তর্জাতিক পেমেন্ট: ")
    add_body_paragraph("bKash/Nagad (Personal/Merchant): 01XXXXXXXXX। পেমেন্ট শেষ করে TrxID এবং স্ক্রিনশট হোয়াটসঅ্যাপে অথবা অনবোর্ডিং ফর্মে যুক্ত করুন।", "• লোকাল পেমেন্ট (বাংলাদেশ): ")

    add_styled_heading("🔒 সুরক্ষিত ক্লায়েন্ট ডেলিভারি গেটওয়ে (Active Client VIP Hub)", level=3)
    add_callout(
        "⚠️ ক্লায়েন্টদের গোপনীয়তা রক্ষা নীতি (Client NDA & Data Privacy):\n"
        "ক্লায়েন্টদের ফাইল ও বিজনেস ডেটার ১০০% গোপনীয়তা বজায় রাখতে আমরা পাবলিক পেজে কোনো ক্লায়েন্টের ফাইল ওপেন রাখি না। প্রতিটি ক্লায়েন্টকে কাজ শুরুর সময় একটি ব্যক্তিগত পাসওয়ার্ড-প্রটেক্টেড বা প্রাইভেট নোশন পোর্টাল লিংক ইমেইল/হোয়াটসঅ্যাপে পাঠানো হয়।\n\n"
        "• আপনার কাজের লাইভ প্রগ্রেস ও ফাইল দেখতে: কাজ শুরুর সময় ইমেইল বা হোয়াটসঅ্যাপে পাঠানো লিংকে প্রবেশ করুন।\n"
        "• লিংক হারিয়ে গেছে বা রিভিশন দরকার? সরাসরি নিচের বাটনে ক্লিক করে প্রজেক্ট আইডি পাঠিয়ে দিন:\n"
        "  👉 [ Request My Portal Link / Revision Update ]",
        "📂 Active Client Verification Hub:",
        "info"
    )

    add_styled_heading("💡 প্রশিক্ষকের জন্য সিক্রেট গাইড: প্রাইভেট ক্লায়েন্ট পোর্টাল সেটআপ", level=3)
    add_body_paragraph("ট্রেইনি তার নিজস্ব নোশনে একটি আলাদা প্রাইভেট পেজ তৈরি করবেন যার নাম হবে: Client Portals [Internal] (এটি কখনো Share to Web করবেন না)।", "১. প্রাইভেট ড্যাশবোর্ড তৈরি: ")
    add_body_paragraph("এই পেজের ভেতরে প্রতি ক্লায়েন্টের জন্য একটি করে সাব-পেজ থাকবে (যেমন: Client #101 - Mr. David)।", "২. ক্লায়েন্ট সাব-পেজ: ")
    add_body_paragraph("১) লাইভ প্রগ্রেস বার (Status: In Progress - 70%), ২) ডেলিভারি বক্স (Google Drive Final Link), ৩) রিভিশন ও ফিডব্যাক বক্স।", "৩. পোর্টালের ভেতরের উপাদান: ")
    add_body_paragraph("ট্রেইনি শুধুমাত্র নির্দিষ্ট ক্লায়েন্টের ইমেইল এড্রেস দিয়ে নোশন Share অপশন থেকে ইনভাইট করবেন অথবা প্রাইভেট ভিউ লিংক ক্লায়েন্টকে পাঠাবেন। এতে ক্লায়েন্টদের মধ্যে ডেটা লিক হওয়ার কোনো ঝুঁকি থাকবে না।", "৪. অ্যাক্সেস শেয়ারিং: ")

    # Save document
    target_path = "Master_Virtual_Office_Blueprint_v2_Updated.docx"
    doc.save(target_path)
    print(f"Successfully generated: {target_path}")

if __name__ == "__main__":
    create_document()
