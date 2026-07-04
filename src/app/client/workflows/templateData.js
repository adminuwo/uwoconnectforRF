export const templateData = {
  "Hospital": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 400,
          "y": 50
        },
        "data": {
          "keyword": "hospital"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 400,
          "y": 200
        },
        "data": {
          "message": "Hello 👋\n\nWelcome to ABC Multispeciality Hospital 🏥\nWe are here to help you with appointments, health services, and patient support.\n\nPlease choose an option below:",
          "buttons": [
            "Book Appointment",
            "Health Packages",
            "Emergency & Support"
          ]
        }
      },
      {
        "id": "dept_select",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "Please select the department you wish to visit:",
          "buttons": [
            "General Physician",
            "Cardiology",
            "Orthopedics"
          ]
        }
      },
      {
        "id": "ask_name",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 700
        },
        "data": {
          "message": "Please enter Patient Name."
        }
      },
      {
        "id": "ask_age",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 850
        },
        "data": {
          "message": "Please enter Patient Age."
        }
      },
      {
        "id": "ask_date",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1000
        },
        "data": {
          "message": "Please share your preferred appointment date."
        }
      },
      {
        "id": "appt_summary",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1150
        },
        "data": {
          "message": "Thank you for sharing the details.\n\n📋 Appointment Summary\nPatient Name: {Name}\nAge: {Age}\nDepartment: {Department}\nPreferred Date: {Date}\n\n✅ Your appointment request has been submitted successfully.\nOur coordinator will contact you within 15 minutes."
        }
      },
      {
        "id": "pkg_select",
        "type": "buttons",
        "position": {
          "x": 400,
          "y": 450
        },
        "data": {
          "message": "Choose a package that suits your needs:",
          "buttons": [
            "Basic Checkup",
            "Heart Health",
            "Family Package"
          ]
        }
      },
      {
        "id": "heart_pkg",
        "type": "buttons",
        "position": {
          "x": 400,
          "y": 700
        },
        "data": {
          "message": "❤️ Heart Health Package\n✔ ECG\n✔ Blood Pressure Screening\n✔ Cholesterol Test\n✔ Cardiology Consultation\n\nSpecial Offer Price: ₹2,999\n\nWould you like to speak with our health advisor?",
          "buttons": [
            "Yes",
            "Call Me Later",
            "Main Menu"
          ]
        }
      },
      {
        "id": "advisor_contact",
        "type": "plain",
        "position": {
          "x": 400,
          "y": 950
        },
        "data": {
          "message": "Thank you.\nOur healthcare advisor will contact you shortly and guide you further."
        }
      },
      {
        "id": "support_select",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 450
        },
        "data": {
          "message": "How can we help you?",
          "buttons": [
            "Emergency",
            "Location",
            "Talk to Support"
          ]
        }
      },
      {
        "id": "emergency_info",
        "type": "plain",
        "position": {
          "x": 700,
          "y": 700
        },
        "data": {
          "message": "🚨 Emergency Helpline\nCall: +91 XXXXX XXXXX\nOur emergency team is available 24×7."
        }
      },
      {
        "id": "location_info",
        "type": "plain",
        "position": {
          "x": 1000,
          "y": 700
        },
        "data": {
          "message": "📍 ABC Multispeciality Hospital\nMain Road, City Center\n\n🗺 Google Maps Location:\n(Location Link)\n\nWe look forward to serving you."
        }
      },
      {
        "id": "talk_support",
        "type": "plain",
        "position": {
          "x": 1300,
          "y": 700
        },
        "data": {
          "message": "👩⚕️ Please briefly describe your concern.\nOur patient care executive will contact you shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "e-start",
        "source": "start",
        "target": "welcome",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-dept",
        "source": "welcome",
        "target": "dept_select",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dept-name-1",
        "source": "dept_select",
        "target": "ask_name",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dept-name-2",
        "source": "dept_select",
        "target": "ask_name",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dept-name-3",
        "source": "dept_select",
        "target": "ask_name",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-name-age",
        "source": "ask_name",
        "target": "ask_age",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-age-date",
        "source": "ask_age",
        "target": "ask_date",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-date-summary",
        "source": "ask_date",
        "target": "appt_summary",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-pkg",
        "source": "welcome",
        "target": "pkg_select",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pkg-heart",
        "source": "pkg_select",
        "target": "heart_pkg",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-heart-advisor",
        "source": "heart_pkg",
        "target": "advisor_contact",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-support",
        "source": "welcome",
        "target": "support_select",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-emerg",
        "source": "support_select",
        "target": "emergency_info",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-loc",
        "source": "support_select",
        "target": "location_info",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-talk",
        "source": "support_select",
        "target": "talk_support",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "Mall": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 800,
          "y": 50
        },
        "data": {
          "keyword": "mall"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 200
        },
        "data": {
          "message": "Hello 👋\n\nWelcome to City Center Mall 🏬\nYour one-stop destination for Shopping, Dining, Entertainment & Exclusive Deals.\n\nHow can we assist you today?",
          "buttons": [
            "Offers & Promotions",
            "Stores & Brands",
            "Customer Assistance"
          ]
        }
      },
      {
        "id": "offers_select",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "🎉 Discover Today's Best Deals\n\nPlease select a category:",
          "buttons": [
            "Fashion Deals",
            "Electronics Offers",
            "Food Court Specials"
          ]
        }
      },
      {
        "id": "fashion_deals",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 700
        },
        "data": {
          "message": "🔥 Up to 60% OFF on Selected Brands\n🔥 Buy 2 Get 1 Free on Fashion Accessories\n🔥 Exclusive Weekend Discounts\n\nWould you like to receive personalized offers and sale alerts?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "ask_name_vip",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 950
        },
        "data": {
          "message": "Please share your name."
        }
      },
      {
        "id": "vip_enrolled",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1100
        },
        "data": {
          "message": "Thank you, {Name}!\n\n🎁 You are now enrolled in our VIP Deals Program.\n\nYou will receive:\n✔ Exclusive Discount Alerts\n✔ Festival Sale Updates\n✔ Early Access Offers\n✔ Special Reward Coupons"
        }
      },
      {
        "id": "stores_select",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 450
        },
        "data": {
          "message": "Please select a category:",
          "buttons": [
            "Fashion",
            "Electronics",
            "Dining & Cafes"
          ]
        }
      },
      {
        "id": "fashion_brands",
        "type": "buttons",
        "position": {
          "x": 400,
          "y": 700
        },
        "data": {
          "message": "Popular Brands Available:\n✔ Zara\n✔ H&M\n✔ Levi's\n✔ Lifestyle\n✔ Max Fashion\n\nWould you like directions to a store?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "ask_store_name",
        "type": "plain",
        "position": {
          "x": 400,
          "y": 950
        },
        "data": {
          "message": "Please enter store name."
        }
      },
      {
        "id": "store_location",
        "type": "plain",
        "position": {
          "x": 400,
          "y": 1100
        },
        "data": {
          "message": "📍 Store Location Shared\n\nYou can also visit our Customer Help Desk for assistance."
        }
      },
      {
        "id": "dining_info",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 700
        },
        "data": {
          "message": "Looking for something delicious?\n\nAvailable Options:\n🍕 Pizza & Fast Food\n☕ Cafes & Coffee Shops\n🍛 Family Restaurants\n\nToday's Specials:\n🔥 Buy 1 Get 1 Pizza\n🔥 Free Dessert with Family Meal\n🔥 Coffee Combo Offers\n\nWould you like table reservation assistance?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "dining_reservation",
        "type": "plain",
        "position": {
          "x": 800,
          "y": 950
        },
        "data": {
          "message": "Our dining concierge will contact you shortly."
        }
      },
      {
        "id": "assist_select",
        "type": "buttons",
        "position": {
          "x": 1600,
          "y": 450
        },
        "data": {
          "message": "How can we help you?",
          "buttons": [
            "Parking Info",
            "Events",
            "Customer Service"
          ]
        }
      },
      {
        "id": "parking_info",
        "type": "plain",
        "position": {
          "x": 1200,
          "y": 700
        },
        "data": {
          "message": "🚗 PARKING INFORMATION\n\nParking Facilities Available:\n✔ Multi-Level Parking\n✔ EV Charging Stations\n✔ Valet Parking\n✔ 24/7 Security Monitoring\n\nCurrent Status:\n🟢 Parking Available\n\nNeed further assistance?\nReply HELP."
        }
      },
      {
        "id": "events_info",
        "type": "buttons",
        "position": {
          "x": 1600,
          "y": 700
        },
        "data": {
          "message": "🎭 EVENTS & ENTERTAINMENT\n\nUpcoming Mall Events\n\n🎵 Live Music Weekend\n🎁 Mega Shopping Festival\n🎨 Kids Activity Zone\n🍔 Food Carnival\n\nWould you like event reminders?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "event_reminders",
        "type": "plain",
        "position": {
          "x": 1600,
          "y": 950
        },
        "data": {
          "message": "🎉 Great!\nYou'll receive event reminders before every major event."
        }
      },
      {
        "id": "cust_service",
        "type": "plain",
        "position": {
          "x": 2000,
          "y": 700
        },
        "data": {
          "message": "👩💼 CUSTOMER SERVICE\n\nPlease tell us how we can assist you.\n\nExamples:\n• Lost & Found\n• Store Complaint\n• Facility Issue\n• General Inquiry"
        }
      },
      {
        "id": "cust_req_reg",
        "type": "plain",
        "position": {
          "x": 2000,
          "y": 850
        },
        "data": {
          "message": "Your request has been registered.\n\nA customer service executive will contact you shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "m-e-start",
        "source": "start",
        "target": "welcome",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-wel-off",
        "source": "welcome",
        "target": "offers_select",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-off-fash",
        "source": "offers_select",
        "target": "fashion_deals",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-fash-vip",
        "source": "fashion_deals",
        "target": "ask_name_vip",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-vip-done",
        "source": "ask_name_vip",
        "target": "vip_enrolled",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-wel-store",
        "source": "welcome",
        "target": "stores_select",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-store-fash",
        "source": "stores_select",
        "target": "fashion_brands",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-fbr-ask",
        "source": "fashion_brands",
        "target": "ask_store_name",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-ask-loc",
        "source": "ask_store_name",
        "target": "store_location",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-store-dine",
        "source": "stores_select",
        "target": "dining_info",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-dine-res",
        "source": "dining_info",
        "target": "dining_reservation",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-wel-ass",
        "source": "welcome",
        "target": "assist_select",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-ass-park",
        "source": "assist_select",
        "target": "parking_info",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-ass-ev",
        "source": "assist_select",
        "target": "events_info",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-ev-rem",
        "source": "events_info",
        "target": "event_reminders",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-ass-cust",
        "source": "assist_select",
        "target": "cust_service",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "m-e-cust-req",
        "source": "cust_service",
        "target": "cust_req_reg",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "Real Estate": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 800,
          "y": 50
        },
        "data": {
          "keyword": "real estate"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 200
        },
        "data": {
          "message": "Hello 👋\n\nWelcome to XYZ Properties 🏠\nWhether you're looking to Buy, Rent, or Invest, we're here to help you find the perfect property.\n\nHow can we assist you today?",
          "buttons": [
            "Buy Property",
            "Rent Property",
            "Property Consultant"
          ]
        }
      },
      {
        "id": "buy_type",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "Great Choice! 🏡\n\nPlease select your preferred property type:",
          "buttons": [
            "Apartment",
            "Villa",
            "Commercial"
          ]
        }
      },
      {
        "id": "buy_budget",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 700
        },
        "data": {
          "message": "Please select your budget range:",
          "buttons": [
            "Under ₹50 Lakhs",
            "₹50L - ₹1 Crore",
            "Above ₹1 Crore"
          ]
        }
      },
      {
        "id": "buy_location",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 950
        },
        "data": {
          "message": "Please share your preferred location."
        }
      },
      {
        "id": "buy_summary",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1100
        },
        "data": {
          "message": "📋 Property Requirement Summary\n\nProperty Type: {Type}\nBudget: {Budget}\nLocation: {Location}\n\n✅ Thank you.\nOur property specialist will shortlist suitable properties and contact you shortly."
        }
      },
      {
        "id": "buy_brochure",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 1250
        },
        "data": {
          "message": "🏡 PROPERTY MATCHING\n\nBased on your requirements, we can provide:\n✔ Ready-to-Move Properties\n✔ Under Construction Projects\n✔ Luxury Residences\n✔ Investment Opportunities\n\nWould you like property brochures?",
          "buttons": [
            "Yes",
            "Schedule a Call"
          ]
        }
      },
      {
        "id": "buy_brochure_ack",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1500
        },
        "data": {
          "message": "Thank you.\nOur team will share detailed property information shortly."
        }
      },
      {
        "id": "rent_type",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 450
        },
        "data": {
          "message": "Looking for a rental property?\n\nPlease select:",
          "buttons": [
            "Apartment",
            "Office Space",
            "Commercial Unit"
          ]
        }
      },
      {
        "id": "rent_budget",
        "type": "plain",
        "position": {
          "x": 800,
          "y": 700
        },
        "data": {
          "message": "Please share your monthly rental budget."
        }
      },
      {
        "id": "rent_location",
        "type": "plain",
        "position": {
          "x": 800,
          "y": 850
        },
        "data": {
          "message": "Please share preferred area/location."
        }
      },
      {
        "id": "rent_ack",
        "type": "plain",
        "position": {
          "x": 800,
          "y": 1000
        },
        "data": {
          "message": "Thank you.\nOur rental specialist will contact you with available options."
        }
      },
      {
        "id": "rent_showcase",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 1150
        },
        "data": {
          "message": "📸 PROPERTY SHOWCASE\n\nAvailable Property Features:\n✔ Photos & Videos\n✔ Floor Plans\n✔ Location Advantages\n✔ Nearby Schools & Hospitals\n✔ Price Details\n\nWould you like to receive property listings directly on WhatsApp?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "consultant_info",
        "type": "plain",
        "position": {
          "x": 1600,
          "y": 450
        },
        "data": {
          "message": "Our experts can assist you with:\n\n🏡 Property Buying\n📈 Real Estate Investment\n🏢 Commercial Properties\n\nPlease share your name and contact number."
        }
      },
      {
        "id": "consultant_ack",
        "type": "plain",
        "position": {
          "x": 1600,
          "y": 650
        },
        "data": {
          "message": "Thank you.\nA senior property consultant will contact you shortly."
        }
      },
      {
        "id": "site_visit",
        "type": "plain",
        "position": {
          "x": 1600,
          "y": 800
        },
        "data": {
          "message": "📅 SITE VISIT BOOKING\n\nInterested in a property?\nSchedule a Site Visit.\n\nPlease share:\n📅 Preferred Date\n⏰ Preferred Time"
        }
      },
      {
        "id": "site_visit_ack",
        "type": "plain",
        "position": {
          "x": 1600,
          "y": 1000
        },
        "data": {
          "message": "✅ Site Visit Request Submitted\n\nOur representative will confirm your visit shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "r-e-start",
        "source": "start",
        "target": "welcome",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-wel-buy",
        "source": "welcome",
        "target": "buy_type",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-buy-b1",
        "source": "buy_type",
        "target": "buy_budget",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-buy-b2",
        "source": "buy_type",
        "target": "buy_budget",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-buy-b3",
        "source": "buy_type",
        "target": "buy_budget",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-bud-loc",
        "source": "buy_budget",
        "target": "buy_location",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-bud-loc2",
        "source": "buy_budget",
        "target": "buy_location",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-bud-loc3",
        "source": "buy_budget",
        "target": "buy_location",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-loc-sum",
        "source": "buy_location",
        "target": "buy_summary",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-sum-bro",
        "source": "buy_summary",
        "target": "buy_brochure",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-bro-ack",
        "source": "buy_brochure",
        "target": "buy_brochure_ack",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-bro-ack2",
        "source": "buy_brochure",
        "target": "buy_brochure_ack",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-wel-rent",
        "source": "welcome",
        "target": "rent_type",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rent-b1",
        "source": "rent_type",
        "target": "rent_budget",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rent-b2",
        "source": "rent_type",
        "target": "rent_budget",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rent-b3",
        "source": "rent_type",
        "target": "rent_budget",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rbud-loc",
        "source": "rent_budget",
        "target": "rent_location",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rloc-ack",
        "source": "rent_location",
        "target": "rent_ack",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-rack-show",
        "source": "rent_ack",
        "target": "rent_showcase",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-wel-cons",
        "source": "welcome",
        "target": "consultant_info",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-cons-ack",
        "source": "consultant_info",
        "target": "consultant_ack",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-ack-site",
        "source": "consultant_ack",
        "target": "site_visit",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "r-e-site-ack",
        "source": "site_visit",
        "target": "site_visit_ack",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "School": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 600,
          "y": 50
        },
        "data": {
          "keyword": "school"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 600,
          "y": 200
        },
        "data": {
          "message": "Hello 👋\n\nWelcome to ABC International School 🎓\nWe are delighted to assist you with admissions, fee information, and student support.\n\nPlease choose an option below:",
          "buttons": [
            "Admission Inquiry",
            "Fee & Academic Info",
            "Parent Support"
          ]
        }
      },
      {
        "id": "ask_name",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "Thank you for your interest in ABC International School.\n\nPlease provide the following details:\n\n👦 Student Name"
        }
      },
      {
        "id": "ask_grade",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 650
        },
        "data": {
          "message": "📚 Grade/Class Applying For"
        }
      },
      {
        "id": "ask_phone",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 800
        },
        "data": {
          "message": "📱 Parent Contact Number"
        }
      },
      {
        "id": "adm_summary",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 950
        },
        "data": {
          "message": "📋 Admission Summary\n\nStudent Name: {Name}\nClass: {Grade}\nContact Number: {Phone}\n\n✅ Your admission inquiry has been submitted successfully.\n\nOur admissions counselor will contact you shortly and guide you through the admission process."
        }
      },
      {
        "id": "highlights",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1150
        },
        "data": {
          "message": "🏫 SCHOOL HIGHLIGHTS\n\nWhy Choose ABC International School?\n\n✔ Experienced Faculty\n✔ Smart Classrooms\n✔ Sports & Extracurricular Activities\n✔ Modern Campus Facilities\n✔ Academic Excellence"
        }
      },
      {
        "id": "acad_select",
        "type": "buttons",
        "position": {
          "x": 600,
          "y": 450
        },
        "data": {
          "message": "Please select:",
          "buttons": [
            "Fee Structure",
            "Curriculum Info",
            "Academic Calendar"
          ]
        }
      },
      {
        "id": "ask_class_fee",
        "type": "plain",
        "position": {
          "x": 400,
          "y": 700
        },
        "data": {
          "message": "Our fee structure varies by grade level.\n\nPlease share the class you are interested in."
        }
      },
      {
        "id": "fee_details",
        "type": "plain",
        "position": {
          "x": 400,
          "y": 850
        },
        "data": {
          "message": "Our admissions team will send the complete fee details and payment information."
        }
      },
      {
        "id": "curriculum",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 700
        },
        "data": {
          "message": "📖 CURRICULUM INFORMATION\n\nWe offer:\n✔ CBSE Curriculum\n✔ Activity-Based Learning\n✔ Digital Learning Support\n✔ Regular Assessments\n\nWould you like a callback from our academic counselor?",
          "buttons": [
            "Yes",
            "No"
          ]
        }
      },
      {
        "id": "callback_ack",
        "type": "plain",
        "position": {
          "x": 800,
          "y": 950
        },
        "data": {
          "message": "Thank you for letting us know. Our team will assist you accordingly."
        }
      },
      {
        "id": "support_select",
        "type": "buttons",
        "position": {
          "x": 1200,
          "y": 450
        },
        "data": {
          "message": "How can we assist you?",
          "buttons": [
            "School Office",
            "Transport Info",
            "Campus Visit"
          ]
        }
      },
      {
        "id": "transport_info",
        "type": "plain",
        "position": {
          "x": 1000,
          "y": 700
        },
        "data": {
          "message": "🚌 TRANSPORT INFORMATION\n\nWe provide safe and reliable transportation services across major city areas.\n\n🚍 GPS Enabled Buses\n👨✈️ Verified Drivers\n📍 Route Tracking\n\nOur transport coordinator will contact you with route details."
        }
      },
      {
        "id": "ask_visit_date",
        "type": "plain",
        "position": {
          "x": 1400,
          "y": 700
        },
        "data": {
          "message": "Please share your preferred visit date."
        }
      },
      {
        "id": "visit_confirm",
        "type": "plain",
        "position": {
          "x": 1400,
          "y": 850
        },
        "data": {
          "message": "Thank you.\n\nOur team will confirm your campus tour shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "s-e-start",
        "source": "start",
        "target": "welcome",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-welcome-adm",
        "source": "welcome",
        "target": "ask_name",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-name-grade",
        "source": "ask_name",
        "target": "ask_grade",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-grade-phone",
        "source": "ask_grade",
        "target": "ask_phone",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-phone-summary",
        "source": "ask_phone",
        "target": "adm_summary",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-summary-high",
        "source": "adm_summary",
        "target": "highlights",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-welcome-acad",
        "source": "welcome",
        "target": "acad_select",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-acad-fee",
        "source": "acad_select",
        "target": "ask_class_fee",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-fee-details",
        "source": "ask_class_fee",
        "target": "fee_details",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-acad-curr",
        "source": "acad_select",
        "target": "curriculum",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-curr-ack-yes",
        "source": "curriculum",
        "target": "callback_ack",
        "sourceHandle": "btn-0",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-curr-ack-no",
        "source": "curriculum",
        "target": "callback_ack",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-welcome-sup",
        "source": "welcome",
        "target": "support_select",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-sup-trans",
        "source": "support_select",
        "target": "transport_info",
        "sourceHandle": "btn-1",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-sup-visit",
        "source": "support_select",
        "target": "ask_visit_date",
        "sourceHandle": "btn-2",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "s-e-visit-conf",
        "source": "ask_visit_date",
        "target": "visit_confirm",
        "animated": true,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "Retail Shop / E-Commerce": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 800,
          "y": 50
        },
        "data": {
          "keyword": "shop, retail, store"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 200
        },
        "data": {
          "message": "👋 Welcome to ABC Store.\nHow can we help you today?",
          "buttons": [
            "🛍 Browse Products",
            "📦 Track Order",
            "🎁 Offers & Discounts",
            "💬 Customer Support"
          ]
        }
      },
      {
        "id": "browse_categories",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "🛍 Browse Products\n\nPlease select a category below:",
          "buttons": [
            "Electronics",
            "Fashion",
            "Home & Living",
            "Grocery",
            "Accessories"
          ]
        }
      },
      {
        "id": "product_select_plain",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 700
        },
        "data": {
          "message": "We have amazing products in this category!\n\nPlease enter the Product Name or Product ID of the item you wish to purchase."
        }
      },
      {
        "id": "ask_qty",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 850
        },
        "data": {
          "message": "Please enter the quantity you wish to order."
        }
      },
      {
        "id": "confirm_order",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1000
        },
        "data": {
          "message": "Please confirm your order details:\nProduct: {Product}\nQuantity: {Qty}\n\nType YES to confirm."
        }
      },
      {
        "id": "thank_you",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 1150
        },
        "data": {
          "message": "🎉 Thank you for your order!\n\nYour order has been confirmed successfully.\nWe will send the invoice and tracking details shortly."
        }
      },
      {
        "id": "ask_order_id",
        "type": "plain",
        "position": {
          "x": 600,
          "y": 450
        },
        "data": {
          "message": "Please enter your 8-digit Order ID to track your order (e.g. #12345678)."
        }
      },
      {
        "id": "order_status_confirm",
        "type": "plain",
        "position": {
          "x": 600,
          "y": 650
        },
        "data": {
          "message": "🔍 Fetching order details...\n\nYour order status will be shared shortly."
        }
      },
      {
        "id": "offers_info",
        "type": "plain",
        "position": {
          "x": 1200,
          "y": 450
        },
        "data": {
          "message": "🎁 XYZ Store Offers & Discounts 🎁\n\n🔥 Today's Offers:\nGet flat 20% off on your first purchase!\n\n🎟️ Coupon Codes:\nUse code FIRST20 at checkout.\n\n✨ New Arrivals:\nCheck out our brand new summer collection!\n\n🏆 Best Sellers:\nOur top-selling smartwatches are back in stock."
        }
      },
      {
        "id": "offers_confirm",
        "type": "plain",
        "position": {
          "x": 1200,
          "y": 650
        },
        "data": {
          "message": "We hope you enjoy shopping with us! Let us know if you need anything else."
        }
      },
      {
        "id": "support_options",
        "type": "buttons",
        "position": {
          "x": 1800,
          "y": 450
        },
        "data": {
          "message": "💬 Customer Support Desk\n\nHow can we help you today?",
          "buttons": [
            "Return Product",
            "Refund",
            "Exchange",
            "Talk to Agent"
          ]
        }
      },
      {
        "id": "support_details",
        "type": "plain",
        "position": {
          "x": 1800,
          "y": 700
        },
        "data": {
          "message": "Please share your Order ID and description of the issue."
        }
      },
      {
        "id": "support_confirm",
        "type": "plain",
        "position": {
          "x": 1800,
          "y": 850
        },
        "data": {
          "message": "✅ Thank you.\n\nYour support ticket has been registered. Our representative will contact you shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "e-start",
        "source": "start",
        "target": "welcome",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-browse",
        "source": "welcome",
        "target": "browse_categories",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-track",
        "source": "welcome",
        "target": "ask_order_id",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-offers",
        "source": "welcome",
        "target": "offers_info",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-support",
        "source": "welcome",
        "target": "support_options",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-browse-prod-0",
        "source": "browse_categories",
        "target": "product_select_plain",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-browse-prod-1",
        "source": "browse_categories",
        "target": "product_select_plain",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-browse-prod-2",
        "source": "browse_categories",
        "target": "product_select_plain",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-browse-prod-3",
        "source": "browse_categories",
        "target": "product_select_plain",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-browse-prod-4",
        "source": "browse_categories",
        "target": "product_select_plain",
        "sourceHandle": "btn-4",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-prod-qty",
        "source": "product_select_plain",
        "target": "ask_qty",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-qty-confirm",
        "source": "ask_qty",
        "target": "confirm_order",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-confirm-thanks",
        "source": "confirm_order",
        "target": "thank_you",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-track-details",
        "source": "ask_order_id",
        "target": "order_status_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-offers-confirm",
        "source": "offers_info",
        "target": "offers_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-options-0",
        "source": "support_options",
        "target": "support_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-options-1",
        "source": "support_options",
        "target": "support_details",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-options-2",
        "source": "support_options",
        "target": "support_details",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-options-3",
        "source": "support_options",
        "target": "support_details",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-support-confirm",
        "source": "support_details",
        "target": "support_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "WhatsApp Banking": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 800,
          "y": 50
        },
        "data": {
          "keyword": "bank, banking, account"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 200
        },
        "data": {
          "message": "🏦 Welcome to ABC Bank.\nHow may we assist you today?",
          "buttons": [
            "💳 Account Services",
            "💰 Loan Services",
            "💸 Money Transfer",
            "☎ Customer Support"
          ]
        }
      },
      {
        "id": "account_services_options",
        "type": "buttons",
        "position": {
          "x": 0,
          "y": 450
        },
        "data": {
          "message": "💳 Account Services\n\nPlease select an option:",
          "buttons": [
            "Balance Enquiry",
            "Mini Statement",
            "Cheque Book Request",
            "Debit Card Services"
          ]
        }
      },
      {
        "id": "ask_account_no",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 700
        },
        "data": {
          "message": "To proceed, please enter your Account Number or Registered Mobile Number."
        }
      },
      {
        "id": "account_service_confirm",
        "type": "plain",
        "position": {
          "x": 0,
          "y": 850
        },
        "data": {
          "message": "Your request has been submitted successfully."
        }
      },
      {
        "id": "loan_services_options",
        "type": "buttons",
        "position": {
          "x": 600,
          "y": 450
        },
        "data": {
          "message": "💰 Loan Services\n\nPlease select the loan type you are interested in:",
          "buttons": [
            "Home Loan",
            "Personal Loan",
            "Car Loan",
            "Business Loan"
          ]
        }
      },
      {
        "id": "ask_loan_details",
        "type": "plain",
        "position": {
          "x": 600,
          "y": 700
        },
        "data": {
          "message": "Please provide your details in the following format:\n- Full Name:\n- Mobile Number:\n- Loan Amount Required:"
        }
      },
      {
        "id": "loan_service_confirm",
        "type": "plain",
        "position": {
          "x": 600,
          "y": 850
        },
        "data": {
          "message": "Our Loan Advisor will contact you shortly."
        }
      },
      {
        "id": "transfer_options",
        "type": "buttons",
        "position": {
          "x": 1200,
          "y": 450
        },
        "data": {
          "message": "💸 Money Transfer\n\nPlease select the transfer method:",
          "buttons": [
            "NEFT",
            "RTGS",
            "IMPS"
          ]
        }
      },
      {
        "id": "ask_transfer_details",
        "type": "plain",
        "position": {
          "x": 1200,
          "y": 700
        },
        "data": {
          "message": "Please enter the details:\n- Sender Name:\n- Receiver Name:\n- Amount:"
        }
      },
      {
        "id": "transfer_confirm",
        "type": "plain",
        "position": {
          "x": 1200,
          "y": 850
        },
        "data": {
          "message": "✅ Transaction details recorded successfully.\n\nYour money transfer request is being processed."
        }
      },
      {
        "id": "banking_support_options",
        "type": "buttons",
        "position": {
          "x": 1800,
          "y": 450
        },
        "data": {
          "message": "☎ Customer Support\n\nPlease select an option:",
          "buttons": [
            "Report Card Lost",
            "Raise Complaint",
            "Speak to Executive"
          ]
        }
      },
      {
        "id": "ask_support_details",
        "type": "plain",
        "position": {
          "x": 1800,
          "y": 700
        },
        "data": {
          "message": "Please briefly describe your issue or concern."
        }
      },
      {
        "id": "banking_support_confirm",
        "type": "plain",
        "position": {
          "x": 1800,
          "y": 850
        },
        "data": {
          "message": "Our banking representative will contact you shortly."
        }
      }
    ],
    "edges": [
      {
        "id": "e-start",
        "source": "start",
        "target": "welcome",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-account",
        "source": "welcome",
        "target": "account_services_options",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-loans",
        "source": "welcome",
        "target": "loan_services_options",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-transfer",
        "source": "welcome",
        "target": "transfer_options",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-support",
        "source": "welcome",
        "target": "banking_support_options",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acc-opt-0",
        "source": "account_services_options",
        "target": "ask_account_no",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acc-opt-1",
        "source": "account_services_options",
        "target": "ask_account_no",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acc-opt-2",
        "source": "account_services_options",
        "target": "ask_account_no",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acc-opt-3",
        "source": "account_services_options",
        "target": "ask_account_no",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acc-confirm",
        "source": "ask_account_no",
        "target": "account_service_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-opt-0",
        "source": "loan_services_options",
        "target": "ask_loan_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-opt-1",
        "source": "loan_services_options",
        "target": "ask_loan_details",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-opt-2",
        "source": "loan_services_options",
        "target": "ask_loan_details",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-opt-3",
        "source": "loan_services_options",
        "target": "ask_loan_details",
        "sourceHandle": "btn-3",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-confirm",
        "source": "ask_loan_details",
        "target": "loan_service_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-trans-opt-0",
        "source": "transfer_options",
        "target": "ask_transfer_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-trans-opt-1",
        "source": "transfer_options",
        "target": "ask_transfer_details",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-trans-opt-2",
        "source": "transfer_options",
        "target": "ask_transfer_details",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-trans-confirm",
        "source": "ask_transfer_details",
        "target": "transfer_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bsup-opt-0",
        "source": "banking_support_options",
        "target": "ask_support_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bsup-opt-1",
        "source": "banking_support_options",
        "target": "ask_support_details",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bsup-opt-2",
        "source": "banking_support_options",
        "target": "ask_support_details",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bsup-confirm",
        "source": "ask_support_details",
        "target": "banking_support_confirm",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  },
  "Enterprise WhatsApp Banking": {
    "nodes": [
      {
        "id": "start",
        "type": "trigger",
        "position": {
          "x": 800,
          "y": 50
        },
        "data": {
          "keyword": "hi, hello, bank, banking"
        }
      },
      {
        "id": "welcome",
        "type": "buttons",
        "position": {
          "x": 800,
          "y": 200
        },
        "data": {
          "message": "🏦 Welcome to ABC Bank Digital Assistant.\n\nWe can help you with banking services 24×7.\n\nPlease choose a service below:",
          "buttons": [
            "💳 Accounts",
            "💳 Cards",
            "✨ More Services 1"
          ]
        }
      },
      {
        "id": "more_services_1",
        "type": "buttons",
        "position": {
          "x": 1150,
          "y": 200
        },
        "data": {
          "message": "✨ Additional Banking Services (1/3):\n\nPlease select an option:",
          "buttons": [
            "💰 Loans",
            "💸 Payments & Transfers",
            "✨ More Services 2"
          ]
        }
      },
      {
        "id": "more_services_2",
        "type": "buttons",
        "position": {
          "x": 1500,
          "y": 200
        },
        "data": {
          "message": "✨ Additional Banking Services (2/3):\n\nPlease select an option:",
          "buttons": [
            "📈 Investments",
            "📦 Fixed Deposits",
            "✨ More Services 3"
          ]
        }
      },
      {
        "id": "more_services_3",
        "type": "buttons",
        "position": {
          "x": 1850,
          "y": 200
        },
        "data": {
          "message": "✨ Additional Banking Services (3/3):\n\nPlease select an option:",
          "buttons": [
            "✍ Cheque Services",
            "☎ Customer Support",
            "📍 Branch & ATM Locator"
          ]
        }
      },
      {
        "id": "acct_menu",
        "type": "buttons",
        "position": {
          "x": -2000,
          "y": 450
        },
        "data": {
          "message": "💳 Account Services\n\nManage your accounts securely:",
          "buttons": [
            "Balance & Details",
            "Account Statements",
            "KYC & Profile Updates"
          ]
        }
      },
      {
        "id": "acct_bal_details",
        "type": "buttons",
        "position": {
          "x": -2600,
          "y": 650
        },
        "data": {
          "message": "💳 Balance & Account Info:\n\nPlease select:",
          "buttons": [
            "Balance Enquiry",
            "Account Details",
            "Back to Account Menu"
          ]
        }
      },
      {
        "id": "ask_acct_num",
        "type": "plain",
        "position": {
          "x": -2600,
          "y": 850
        },
        "data": {
          "message": "Please enter your 12-digit Bank Account Number to proceed."
        }
      },
      {
        "id": "ask_acct_otp",
        "type": "plain",
        "position": {
          "x": -2600,
          "y": 1000
        },
        "data": {
          "message": "🔐 An OTP has been sent to your registered mobile number ending in ****.\n\nPlease enter the 6-digit OTP to authenticate:"
        }
      },
      {
        "id": "verify_acct_otp",
        "type": "condition",
        "position": {
          "x": -2600,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "acct_bal_success",
        "type": "plain",
        "position": {
          "x": -2800,
          "y": 1350
        },
        "data": {
          "message": "✅ Verification Successful!\n\n💳 Balance Summary:\nAvailable Balance: ₹1,45,230.50\nLedger Balance: ₹1,45,230.50\n\nReference: TXN-ACC-98246"
        }
      },
      {
        "id": "acct_otp_error",
        "type": "buttons",
        "position": {
          "x": -2400,
          "y": 1350
        },
        "data": {
          "message": "❌ Verification Failed.\n\nThe OTP you entered is invalid. Please select an option:",
          "buttons": [
            "Resend OTP",
            "Speak to Agent",
            "Main Menu"
          ]
        }
      },
      {
        "id": "acct_statement_menu",
        "type": "buttons",
        "position": {
          "x": -2000,
          "y": 650
        },
        "data": {
          "message": "📄 Account Statements:\n\nPlease select statement type:",
          "buttons": [
            "Mini Statement",
            "Email Statement",
            "Back"
          ]
        }
      },
      {
        "id": "ask_stmt_acct",
        "type": "plain",
        "position": {
          "x": -2000,
          "y": 850
        },
        "data": {
          "message": "Please enter your 12-digit Bank Account Number to retrieve statement."
        }
      },
      {
        "id": "ask_stmt_otp",
        "type": "plain",
        "position": {
          "x": -2000,
          "y": 1000
        },
        "data": {
          "message": "🔐 Please enter the 6-digit OTP sent to your registered mobile number:"
        }
      },
      {
        "id": "verify_stmt_otp",
        "type": "condition",
        "position": {
          "x": -2000,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "stmt_routing",
        "type": "condition",
        "position": {
          "x": -2000,
          "y": 1350
        },
        "data": {
          "condition": "IF TYPE = MINI",
          "conditionField": "type",
          "conditionOperator": "=",
          "conditionValue": "MINI"
        }
      },
      {
        "id": "mini_stmt_success",
        "type": "plain",
        "position": {
          "x": -2200,
          "y": 1550
        },
        "data": {
          "message": "✅ Mini Statement for A/c ****4567:\n\n1. 04-Jul: CR ₹2,500.00 (UPI Inward)\n2. 02-Jul: DR ₹120.00 (ATM Fee)\n3. 30-Jun: DR ₹1,500.00 (NFC Merchant)\n4. 28-Jun: CR ₹45,000.00 (Salary)\n\nReference: STMT-38491"
        }
      },
      {
        "id": "ask_email_period",
        "type": "buttons",
        "position": {
          "x": -1800,
          "y": 1550
        },
        "data": {
          "message": "Select statement period:",
          "buttons": [
            "Last 3 Months",
            "Last 6 Months",
            "Financial Year"
          ]
        }
      },
      {
        "id": "email_stmt_success",
        "type": "plain",
        "position": {
          "x": -1800,
          "y": 1750
        },
        "data": {
          "message": "✅ Your statement has been sent successfully to your registered email address.\n\nReference: REQ-STMT-77492"
        }
      },
      {
        "id": "kyc_update_menu",
        "type": "buttons",
        "position": {
          "x": -1400,
          "y": 650
        },
        "data": {
          "message": "👤 KYC & Profile Information:\n\nPlease select what you wish to update:",
          "buttons": [
            "Update KYC Status",
            "Change Address",
            "Update Mobile"
          ]
        }
      },
      {
        "id": "ask_kyc_acct",
        "type": "plain",
        "position": {
          "x": -1400,
          "y": 850
        },
        "data": {
          "message": "Please enter your 12-digit Bank Account Number to retrieve profile data."
        }
      },
      {
        "id": "ask_kyc_otp",
        "type": "plain",
        "position": {
          "x": -1400,
          "y": 1000
        },
        "data": {
          "message": "🔐 Enter the security OTP to unlock KYC updates:"
        }
      },
      {
        "id": "verify_kyc_otp",
        "type": "condition",
        "position": {
          "x": -1400,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "kyc_doc_select",
        "type": "buttons",
        "position": {
          "x": -1400,
          "y": 1350
        },
        "data": {
          "message": "Select Document to Upload:",
          "buttons": [
            "Aadhaar Card",
            "PAN Card",
            "Passport"
          ]
        }
      },
      {
        "id": "ask_doc_upload",
        "type": "plain",
        "position": {
          "x": -1400,
          "y": 1550
        },
        "data": {
          "message": "Please upload a clear scanned copy or photo of your selected document."
        }
      },
      {
        "id": "kyc_success",
        "type": "plain",
        "position": {
          "x": -1400,
          "y": 1750
        },
        "data": {
          "message": "✅ Profile updates / KYC documents received!\n\nOur validation team will verify your uploaded document and update details in 24-48 working hours.\n\nTicket ID: KYC-88371"
        }
      },
      {
        "id": "cards_menu",
        "type": "buttons",
        "position": {
          "x": -300,
          "y": 450
        },
        "data": {
          "message": "💳 Cards Management\n\nSelect Card Type:",
          "buttons": [
            "Debit Cards",
            "Credit Cards",
            "Main Menu"
          ]
        }
      },
      {
        "id": "debit_card_menu",
        "type": "buttons",
        "position": {
          "x": -600,
          "y": 650
        },
        "data": {
          "message": "💳 Debit Card Services:\n\nPlease select:",
          "buttons": [
            "Block / Unblock Card",
            "Generate PIN",
            "Limits & International"
          ]
        }
      },
      {
        "id": "debit_auth_card",
        "type": "plain",
        "position": {
          "x": -600,
          "y": 850
        },
        "data": {
          "message": "Please enter the last 4 digits of your Debit Card."
        }
      },
      {
        "id": "debit_auth_otp",
        "type": "plain",
        "position": {
          "x": -600,
          "y": 1000
        },
        "data": {
          "message": "🔐 Enter the 6-digit verification code to confirm card action:"
        }
      },
      {
        "id": "debit_otp_verify",
        "type": "condition",
        "position": {
          "x": -600,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "debit_action_router",
        "type": "condition",
        "position": {
          "x": -600,
          "y": 1300
        },
        "data": {
          "condition": "IF ACTION = BLOCK",
          "conditionField": "action",
          "conditionOperator": "=",
          "conditionValue": "BLOCK"
        }
      },
      {
        "id": "debit_block_success",
        "type": "plain",
        "position": {
          "x": -800,
          "y": 1500
        },
        "data": {
          "message": "🔒 Card Action Successful!\n\nYour Debit Card ending in **** has been temporarily blocked/unblocked as per request.\n\nRef: CRD-BLK-88241"
        }
      },
      {
        "id": "debit_pin_limit_router",
        "type": "condition",
        "position": {
          "x": -400,
          "y": 1500
        },
        "data": {
          "condition": "IF ACTION = PIN",
          "conditionField": "action",
          "conditionOperator": "=",
          "conditionValue": "PIN"
        }
      },
      {
        "id": "ask_new_pin",
        "type": "plain",
        "position": {
          "x": -500,
          "y": 1700
        },
        "data": {
          "message": "Please enter your new 4-digit Debit Card PIN:"
        }
      },
      {
        "id": "pin_success",
        "type": "plain",
        "position": {
          "x": -500,
          "y": 1900
        },
        "data": {
          "message": "✅ PIN Generated Successfully!\n\nYour new Debit Card PIN is now active. Never share this with anyone."
        }
      },
      {
        "id": "debit_limit_options",
        "type": "buttons",
        "position": {
          "x": -200,
          "y": 1700
        },
        "data": {
          "message": "Manage Debit Card Limits:",
          "buttons": [
            "Enable International Usage",
            "Set Daily Limit to ₹50k",
            "Back"
          ]
        }
      },
      {
        "id": "debit_limit_success",
        "type": "plain",
        "position": {
          "x": -200,
          "y": 1900
        },
        "data": {
          "message": "✅ Limit Configuration Updated!\n\nYour international usage and limits have been updated successfully.\n\nRef: CRD-LMT-9924"
        }
      },
      {
        "id": "credit_card_menu",
        "type": "buttons",
        "position": {
          "x": 100,
          "y": 650
        },
        "data": {
          "message": "💳 Credit Card Services:\n\nPlease select an option:",
          "buttons": [
            "Outstanding & Bills",
            "Increase Limit",
            "Block / EMI / Rewards"
          ]
        }
      },
      {
        "id": "cc_auth_card",
        "type": "plain",
        "position": {
          "x": 100,
          "y": 850
        },
        "data": {
          "message": "Please enter the last 4 digits of your Credit Card."
        }
      },
      {
        "id": "cc_auth_otp",
        "type": "plain",
        "position": {
          "x": 100,
          "y": 1000
        },
        "data": {
          "message": "🔐 Enter the 6-digit OTP sent to your registered mobile number:"
        }
      },
      {
        "id": "cc_otp_verify",
        "type": "condition",
        "position": {
          "x": 100,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "cc_action_router",
        "type": "condition",
        "position": {
          "x": 100,
          "y": 1300
        },
        "data": {
          "condition": "IF ACTION = BILLS",
          "conditionField": "action",
          "conditionOperator": "=",
          "conditionValue": "BILLS"
        }
      },
      {
        "id": "cc_bill_details",
        "type": "buttons",
        "position": {
          "x": -100,
          "y": 1500
        },
        "data": {
          "message": "💳 Credit Card Account Status:\n\nOutstanding Balance: ₹45,230.12\nMinimum Due: ₹2,260.00\nDue Date: 18-Jul\n\nWould you like to pay your bill?",
          "buttons": [
            "Pay Total Outstanding",
            "Pay Minimum Due",
            "Back"
          ]
        }
      },
      {
        "id": "cc_pay_success",
        "type": "plain",
        "position": {
          "x": -100,
          "y": 1700
        },
        "data": {
          "message": "💸 Payment Successful!\n\nYour credit card payment has been processed successfully.\n\nRef: CC-PAY-981240"
        }
      },
      {
        "id": "cc_limit_block_router",
        "type": "condition",
        "position": {
          "x": 400,
          "y": 1500
        },
        "data": {
          "condition": "IF ACTION = LIMIT",
          "conditionField": "action",
          "conditionOperator": "=",
          "conditionValue": "LIMIT"
        }
      },
      {
        "id": "cc_limit_info",
        "type": "buttons",
        "position": {
          "x": 300,
          "y": 1700
        },
        "data": {
          "message": "🎉 Great News!\n\nYou are eligible for an increased credit limit of up to ₹5,00,000.\n\nWould you like to apply immediately?",
          "buttons": [
            "Confirm Limit Increase",
            "Cancel"
          ]
        }
      },
      {
        "id": "cc_limit_success",
        "type": "plain",
        "position": {
          "x": 300,
          "y": 1900
        },
        "data": {
          "message": "✅ Credit Limit Increased!\n\nYour new credit limit has been activated. Check your app for details.\n\nRef: CC-LMT-8837"
        }
      },
      {
        "id": "cc_other_options",
        "type": "buttons",
        "position": {
          "x": 600,
          "y": 1700
        },
        "data": {
          "message": "Additional Credit Card Options:",
          "buttons": [
            "Block Credit Card",
            "EMI Conversion",
            "Rewards Points Balance"
          ]
        }
      },
      {
        "id": "cc_other_success",
        "type": "plain",
        "position": {
          "x": 600,
          "y": 1900
        },
        "data": {
          "message": "✅ Request Registered Successfully!\n\nYour selected action has been recorded. Reference updates will be shared shortly."
        }
      },
      {
        "id": "loans_menu",
        "type": "buttons",
        "position": {
          "x": 900,
          "y": 450
        },
        "data": {
          "message": "💰 Loan Services\n\nPlease select the loan category:",
          "buttons": [
            "Home / Personal Loan",
            "Car / Business Loan",
            "Education / Gold Loan"
          ]
        }
      },
      {
        "id": "loan_type_selection",
        "type": "buttons",
        "position": {
          "x": 900,
          "y": 650
        },
        "data": {
          "message": "Select Loan Type:",
          "buttons": [
            "Home Loan",
            "Personal Loan",
            "Car Loan"
          ]
        }
      },
      {
        "id": "ask_loan_name",
        "type": "plain",
        "position": {
          "x": 900,
          "y": 850
        },
        "data": {
          "message": "To check eligibility, please enter your Full Name:"
        }
      },
      {
        "id": "ask_loan_mobile",
        "type": "plain",
        "position": {
          "x": 900,
          "y": 1000
        },
        "data": {
          "message": "Please enter your 10-digit mobile number:"
        }
      },
      {
        "id": "ask_loan_income",
        "type": "plain",
        "position": {
          "x": 900,
          "y": 1150
        },
        "data": {
          "message": "Please enter your net monthly take-home salary or income:"
        }
      },
      {
        "id": "ask_loan_amount",
        "type": "plain",
        "position": {
          "x": 900,
          "y": 1300
        },
        "data": {
          "message": "Please enter the required loan amount (e.g. 500000):"
        }
      },
      {
        "id": "loan_elig_check",
        "type": "condition",
        "position": {
          "x": 900,
          "y": 1450
        },
        "data": {
          "condition": "IF INCOME > 50000",
          "conditionField": "income",
          "conditionOperator": ">",
          "conditionValue": "50000"
        }
      },
      {
        "id": "loan_eligible_success",
        "type": "plain",
        "position": {
          "x": 750,
          "y": 1650
        },
        "data": {
          "message": "🎉 Pre-Approved Eligibility Confirmed!\n\nLead ID: LN-99241\n\nOur Loans Relationship Manager will contact you within 2 hours."
        }
      },
      {
        "id": "loan_eligible_fallback",
        "type": "plain",
        "position": {
          "x": 1050,
          "y": 1650
        },
        "data": {
          "message": "Thank you for sharing your details. Your application (Lead ID: LN-99242) has been registered. Our representative will contact you shortly."
        }
      },
      {
        "id": "payments_menu",
        "type": "buttons",
        "position": {
          "x": 2200,
          "y": 450
        },
        "data": {
          "message": "💸 Payments & Transfers\n\nSelect payment method:",
          "buttons": [
            "UPI Instant Transfer",
            "NEFT / RTGS / IMPS",
            "International Transfer"
          ]
        }
      },
      {
        "id": "ask_upi_id",
        "type": "plain",
        "position": {
          "x": 2000,
          "y": 650
        },
        "data": {
          "message": "Please enter the recipient's UPI ID (e.g. username@upi):"
        }
      },
      {
        "id": "ask_upi_amount",
        "type": "plain",
        "position": {
          "x": 2000,
          "y": 800
        },
        "data": {
          "message": "Please enter the amount to transfer:"
        }
      },
      {
        "id": "confirm_upi_pay",
        "type": "buttons",
        "position": {
          "x": 2000,
          "y": 950
        },
        "data": {
          "message": "Review UPI Payment:\n\nRecipient: {Recipient}\nAmount: ₹{Amount}\n\nConfirm transaction?",
          "buttons": [
            "Yes, Confirm",
            "Cancel & Exit"
          ]
        }
      },
      {
        "id": "ask_upi_pin",
        "type": "plain",
        "position": {
          "x": 1900,
          "y": 1150
        },
        "data": {
          "message": "🔐 Enter your 6-digit UPI PIN to finalize payment:"
        }
      },
      {
        "id": "upi_pay_success",
        "type": "plain",
        "position": {
          "x": 1900,
          "y": 1300
        },
        "data": {
          "message": "💸 UPI Payment Successful!\n\nTransferred: ₹{Amount}\nTo: {Recipient}\n\nRef: UPI-9938104"
        }
      },
      {
        "id": "bank_transfer_menu",
        "type": "buttons",
        "position": {
          "x": 2400,
          "y": 650
        },
        "data": {
          "message": "💸 Funds Transfer:\n\nSelect transfer channel:",
          "buttons": [
            "IMPS (Instant)",
            "NEFT / RTGS",
            "Back"
          ]
        }
      },
      {
        "id": "ask_beneficiary_acct",
        "type": "plain",
        "position": {
          "x": 2400,
          "y": 850
        },
        "data": {
          "message": "Please enter the Beneficiary Account Number:"
        }
      },
      {
        "id": "ask_beneficiary_ifsc",
        "type": "plain",
        "position": {
          "x": 2400,
          "y": 1000
        },
        "data": {
          "message": "Please enter the 11-character bank IFSC Code:"
        }
      },
      {
        "id": "ask_transfer_amount",
        "type": "plain",
        "position": {
          "x": 2400,
          "y": 1150
        },
        "data": {
          "message": "Please enter the amount to transfer:"
        }
      },
      {
        "id": "ask_transfer_otp",
        "type": "plain",
        "position": {
          "x": 2400,
          "y": 1300
        },
        "data": {
          "message": "🔐 A security OTP has been sent to your mobile. Enter OTP to authenticate transaction:"
        }
      },
      {
        "id": "verify_transfer_otp",
        "type": "condition",
        "position": {
          "x": 2400,
          "y": 1450
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "transfer_success",
        "type": "plain",
        "position": {
          "x": 2400,
          "y": 1650
        },
        "data": {
          "message": "💸 Bank Transfer Completed Successfully!\n\nBeneficiary: {A/c}\nAmount: ₹{Amount}\nChannel: Bank NetBanking\n\nRef: TXN-BANK-883719"
        }
      },
      {
        "id": "intl_transfer_info",
        "type": "plain",
        "position": {
          "x": 2800,
          "y": 650
        },
        "data": {
          "message": "🌎 International Money Transfer (Outward Remittance)\n\nABC Bank supports outward money transfers across 120+ countries.\n\nPlease share your relationship manager's email or registered phone number to initiate wire transfer details."
        }
      },
      {
        "id": "intl_transfer_ack",
        "type": "plain",
        "position": {
          "x": 2800,
          "y": 850
        },
        "data": {
          "message": "✅ Request Registered.\n\nOur Remittance Desk advisor will contact you within 4 hours to verify paperwork (Form A2) and execute the wire transfer."
        }
      },
      {
        "id": "investments_menu",
        "type": "buttons",
        "position": {
          "x": 3400,
          "y": 450
        },
        "data": {
          "message": "📈 Investment Desk\n\nChoose an investment channel:",
          "buttons": [
            "Mutual Funds & SIP",
            "Demat Account",
            "Insurance Products"
          ]
        }
      },
      {
        "id": "mf_sip_menu",
        "type": "buttons",
        "position": {
          "x": 3200,
          "y": 650
        },
        "data": {
          "message": "Mutual Funds Options:",
          "buttons": [
            "Explore Top Funds",
            "Start a SIP",
            "Back"
          ]
        }
      },
      {
        "id": "collect_investor_details",
        "type": "plain",
        "position": {
          "x": 3200,
          "y": 850
        },
        "data": {
          "message": "Please enter your PAN Card number to verify your KYC details:"
        }
      },
      {
        "id": "investor_kyc_verify",
        "type": "condition",
        "position": {
          "x": 3200,
          "y": 1000
        },
        "data": {
          "condition": "IF KYC = VERIFIED",
          "conditionField": "kyc",
          "conditionOperator": "=",
          "conditionValue": "VERIFIED"
        }
      },
      {
        "id": "investor_success",
        "type": "plain",
        "position": {
          "x": 3050,
          "y": 1200
        },
        "data": {
          "message": "✅ KYC Status: VERIFIED\n\nYour Demat/Mutual fund account setup is ready.\n\nA XYZ Wealth Manager will contact you shortly to plan your portfolio allocations."
        }
      },
      {
        "id": "investor_fallback",
        "type": "plain",
        "position": {
          "x": 3350,
          "y": 1200
        },
        "data": {
          "message": "❌ KYC Pending.\n\nPlease complete your online KYC registry before initializing mutual fund transactions."
        }
      },
      {
        "id": "demat_info",
        "type": "plain",
        "position": {
          "x": 3600,
          "y": 650
        },
        "data": {
          "message": "🏢 Demat Account opening:\n\nFeatures:\n✔ 3-in-1 Account\n✔ Zero brokerage on Equity Delivery\n✔ Fast executions\n\nEnter Aadhaar to link Demat:"
        }
      },
      {
        "id": "demat_ack",
        "type": "plain",
        "position": {
          "x": 3600,
          "y": 850
        },
        "data": {
          "message": "✅ Account Opening Initiated!\n\nYour details have been shared with our brokerage partner. Account credentials will be shared on email shortly."
        }
      },
      {
        "id": "insurance_menu",
        "type": "buttons",
        "position": {
          "x": 4000,
          "y": 650
        },
        "data": {
          "message": "🛡 Insurance Products:\n\nSelect type:",
          "buttons": [
            "Life Insurance",
            "Health Insurance",
            "Motor Insurance"
          ]
        }
      },
      {
        "id": "ins_success",
        "type": "plain",
        "position": {
          "x": 4000,
          "y": 850
        },
        "data": {
          "message": "✅ Thank you!\n\nOur insurance desk representative will share custom policy quotes shortly."
        }
      },
      {
        "id": "fd_menu",
        "type": "buttons",
        "position": {
          "x": 4600,
          "y": 450
        },
        "data": {
          "message": "📦 Fixed Deposits (FD):\n\nPlease select an action:",
          "buttons": [
            "Open Fixed Deposit",
            "Close / Renew FD",
            "Interest Certificate"
          ]
        }
      },
      {
        "id": "ask_fd_cust_id",
        "type": "plain",
        "position": {
          "x": 4600,
          "y": 650
        },
        "data": {
          "message": "Please enter your 9-digit Customer ID to proceed:"
        }
      },
      {
        "id": "ask_fd_amount",
        "type": "plain",
        "position": {
          "x": 4600,
          "y": 800
        },
        "data": {
          "message": "Enter the principal amount you wish to deposit (Min ₹10,000):"
        }
      },
      {
        "id": "ask_fd_tenure",
        "type": "plain",
        "position": {
          "x": 4600,
          "y": 950
        },
        "data": {
          "message": "Enter FD tenure in months (e.g. 12, 24, 36, 60):"
        }
      },
      {
        "id": "fd_calc_returns",
        "type": "buttons",
        "position": {
          "x": 4600,
          "y": 1100
        },
        "data": {
          "message": "Fixed Deposit Summary:\n\nPrincipal: ₹{Amount}\nTenure: {Tenure} Months\nInterest Rate: 7.10% p.a.\nMaturity Amount: ₹{Maturity}\n\nProceed to create FD?",
          "buttons": [
            "Yes, Create FD",
            "Cancel"
          ]
        }
      },
      {
        "id": "fd_otp",
        "type": "plain",
        "position": {
          "x": 4500,
          "y": 1300
        },
        "data": {
          "message": "🔐 Enter the 6-digit OTP to authenticate Fixed Deposit setup:"
        }
      },
      {
        "id": "fd_success",
        "type": "plain",
        "position": {
          "x": 4500,
          "y": 1450
        },
        "data": {
          "message": "🎉 Fixed Deposit Created Successfully!\n\nFD Advice PDF will be sent to your registered email address.\n\nReceipt Number: FD-9924103"
        }
      },
      {
        "id": "cheque_menu",
        "type": "buttons",
        "position": {
          "x": 5800,
          "y": 450
        },
        "data": {
          "message": "✍ Cheque Services:\n\nPlease select service:",
          "buttons": [
            "Cheque Book Request",
            "Stop Cheque / Status",
            "Positive Pay Registry"
          ]
        }
      },
      {
        "id": "ask_chq_acct",
        "type": "plain",
        "position": {
          "x": 5800,
          "y": 650
        },
        "data": {
          "message": "Please enter your 12-digit Bank Account Number to authorize Cheque service:"
        }
      },
      {
        "id": "ask_chq_otp",
        "type": "plain",
        "position": {
          "x": 5800,
          "y": 800
        },
        "data": {
          "message": "🔐 Enter the security OTP to confirm cheque service request:"
        }
      },
      {
        "id": "chq_otp_verify",
        "type": "condition",
        "position": {
          "x": 5800,
          "y": 950
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "chq_action_router",
        "type": "condition",
        "position": {
          "x": 5800,
          "y": 1100
        },
        "data": {
          "condition": "IF ACTION = REQ",
          "conditionField": "action",
          "conditionOperator": "=",
          "conditionValue": "REQ"
        }
      },
      {
        "id": "chq_request_success",
        "type": "plain",
        "position": {
          "x": 5600,
          "y": 1300
        },
        "data": {
          "message": "✅ Cheque Book Request Placed!\n\nYour new 25-leaf cheque book will be delivered to your registered home address in 5-7 working days.\n\nRef: REQ-CHQ-11928"
        }
      },
      {
        "id": "chq_stop_success",
        "type": "plain",
        "position": {
          "x": 6000,
          "y": 1300
        },
        "data": {
          "message": "✅ Request Registered Successfully!\n\nYour stop cheque / positive pay registry instruction has been processed.\n\nRef: CHQ-SRV-99214"
        }
      },
      {
        "id": "support_menu",
        "type": "buttons",
        "position": {
          "x": 7000,
          "y": 450
        },
        "data": {
          "message": "☎ Customer Support & Help Desk\n\nHow can we help you today?",
          "buttons": [
            "Raise Complaint",
            "Report Fraud / Lost Card",
            "Speak to Human Agent"
          ]
        }
      },
      {
        "id": "ask_complaint_cat",
        "type": "buttons",
        "position": {
          "x": 6800,
          "y": 650
        },
        "data": {
          "message": "Please select issue category:",
          "buttons": [
            "Transaction Failure",
            "Digital App / Login Issue",
            "Other Complaints"
          ]
        }
      },
      {
        "id": "ask_complaint_desc",
        "type": "plain",
        "position": {
          "x": 6800,
          "y": 850
        },
        "data": {
          "message": "Please write a brief description of the issue you experienced:"
        }
      },
      {
        "id": "ask_screenshot_upload",
        "type": "plain",
        "position": {
          "x": 6800,
          "y": 1000
        },
        "data": {
          "message": "Please upload a screenshot of the transaction / error message (Optional). Type SKIP to proceed without upload:"
        }
      },
      {
        "id": "complaint_success",
        "type": "plain",
        "position": {
          "x": 6800,
          "y": 1150
        },
        "data": {
          "message": "✅ Complaint Registered Successfully!\n\nTicket Number: TKT-COMP-449102\nEstimated Resolution Time: 24 Hours\n\nOur team is working on it."
        }
      },
      {
        "id": "fraud_report_menu",
        "type": "buttons",
        "position": {
          "x": 7200,
          "y": 650
        },
        "data": {
          "message": "🚨 EMERGENCY BLOCK & FRAUD REPORT\n\nSelect Card to Block IMMEDIATELY:",
          "buttons": [
            "Block All Active Cards",
            "Report Unauthorized Transaction",
            "Back"
          ]
        }
      },
      {
        "id": "fraud_block_acct",
        "type": "plain",
        "position": {
          "x": 7200,
          "y": 850
        },
        "data": {
          "message": "Please enter your registered mobile number for emergency verification:"
        }
      },
      {
        "id": "fraud_otp",
        "type": "plain",
        "position": {
          "x": 7200,
          "y": 1000
        },
        "data": {
          "message": "🚨 ENTER THE EMERGENCY OTP TO INITIATE CARD BLOCK:"
        }
      },
      {
        "id": "fraud_otp_verify",
        "type": "condition",
        "position": {
          "x": 7200,
          "y": 1150
        },
        "data": {
          "condition": "IF OTP = 123456",
          "conditionField": "otp",
          "conditionOperator": "=",
          "conditionValue": "123456"
        }
      },
      {
        "id": "fraud_block_success",
        "type": "plain",
        "position": {
          "x": 7200,
          "y": 1350
        },
        "data": {
          "message": "🚨 EMERGENCY BLOCKED!\n\nAll your debit and credit cards have been securely BLOCKED. You will receive replacements in 5 working days.\n\nTicket ID: FRD-99420"
        }
      },
      {
        "id": "agent_connect",
        "type": "plain",
        "position": {
          "x": 7600,
          "y": 650
        },
        "data": {
          "message": "🔄 Connecting you to a live chat representative...\n\nAll agents are busy assisting other clients. Estimated wait time is 4 minutes. Thank you for your patience."
        }
      },
      {
        "id": "locator_menu",
        "type": "buttons",
        "position": {
          "x": 8200,
          "y": 450
        },
        "data": {
          "message": "📍 Branch & ATM Locator\n\nHow would you like to search?",
          "buttons": [
            "Share Current Location",
            "Search by PIN Code / City",
            "Branch Working Hours"
          ]
        }
      },
      {
        "id": "ask_locator_pin",
        "type": "plain",
        "position": {
          "x": 8200,
          "y": 650
        },
        "data": {
          "message": "Please type in your 6-digit PIN Code or City name (e.g. 400001, Mumbai):"
        }
      },
      {
        "id": "show_nearest_locations",
        "type": "plain",
        "position": {
          "x": 8200,
          "y": 850
        },
        "data": {
          "message": "📍 Nearest ABC Bank Locations found:\n\n1. City Center Branch & ATM\nAddress: Sector 15, CBD Belapur\n🗺 Map Link: (Link)\n\n2. Express ATM Metro Plaza\nAddress: Ground Floor, Metro Station\n🗺 Map Link: (Link)"
        }
      },
      {
        "id": "branch_hours_info",
        "type": "plain",
        "position": {
          "x": 8600,
          "y": 650
        },
        "data": {
          "message": "🕒 Branch Working Hours:\n\nMon - Fri: 9:30 AM to 4:00 PM\nSaturday (1st, 3rd, 5th): 9:30 AM to 4:00 PM\nSunday & Holidays: CLOSED\n\nNeed assistance? Reply SUPPORT."
        }
      }
    ],
    "edges": [
      {
        "id": "e-start-welcome",
        "source": "start",
        "target": "welcome",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-more1",
        "source": "welcome",
        "target": "more_services_1",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more1-more2",
        "source": "more_services_1",
        "target": "more_services_2",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more2-more3",
        "source": "more_services_2",
        "target": "more_services_3",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-acct",
        "source": "welcome",
        "target": "acct_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-bal",
        "source": "acct_menu",
        "target": "acct_bal_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-bal-back",
        "source": "acct_bal_details",
        "target": "acct_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bal-enq-ask",
        "source": "acct_bal_details",
        "target": "ask_acct_num",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-det-ask",
        "source": "acct_bal_details",
        "target": "ask_acct_num",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-num-otp",
        "source": "ask_acct_num",
        "target": "ask_acct_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-otp-verify",
        "source": "ask_acct_otp",
        "target": "verify_acct_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-otp-true",
        "source": "verify_acct_otp",
        "target": "acct_bal_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-otp-false",
        "source": "verify_acct_otp",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-otp-retry",
        "source": "acct_otp_error",
        "target": "ask_acct_otp",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-otp-menu",
        "source": "acct_otp_error",
        "target": "welcome",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-stmt",
        "source": "acct_menu",
        "target": "acct_statement_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-stmt-back",
        "source": "acct_statement_menu",
        "target": "acct_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-mini",
        "source": "acct_statement_menu",
        "target": "ask_stmt_acct",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-email",
        "source": "acct_statement_menu",
        "target": "ask_stmt_acct",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-acct-otp",
        "source": "ask_stmt_acct",
        "target": "ask_stmt_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-otp-verify",
        "source": "ask_stmt_otp",
        "target": "verify_stmt_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-otp-true",
        "source": "verify_stmt_otp",
        "target": "stmt_routing",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-stmt-otp-false",
        "source": "verify_stmt_otp",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-route-mini",
        "source": "stmt_routing",
        "target": "mini_stmt_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-route-email",
        "source": "stmt_routing",
        "target": "ask_email_period",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-email-period-1",
        "source": "ask_email_period",
        "target": "email_stmt_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-email-period-2",
        "source": "ask_email_period",
        "target": "email_stmt_success",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-email-period-3",
        "source": "ask_email_period",
        "target": "email_stmt_success",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-acct-kyc",
        "source": "acct_menu",
        "target": "kyc_update_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-status",
        "source": "kyc_update_menu",
        "target": "ask_kyc_acct",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-addr",
        "source": "kyc_update_menu",
        "target": "ask_kyc_acct",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-mob",
        "source": "kyc_update_menu",
        "target": "ask_kyc_acct",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-acct-otp",
        "source": "ask_kyc_acct",
        "target": "ask_kyc_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-otp-verify",
        "source": "ask_kyc_otp",
        "target": "verify_kyc_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-otp-true",
        "source": "verify_kyc_otp",
        "target": "kyc_doc_select",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-otp-false",
        "source": "verify_kyc_otp",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-doc-1",
        "source": "kyc_doc_select",
        "target": "ask_doc_upload",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-doc-2",
        "source": "kyc_doc_select",
        "target": "ask_doc_upload",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-doc-3",
        "source": "kyc_doc_select",
        "target": "ask_doc_upload",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upload-success",
        "source": "ask_doc_upload",
        "target": "kyc_success",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-welcome-cards",
        "source": "welcome",
        "target": "cards_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cards-back-menu",
        "source": "cards_menu",
        "target": "welcome",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cards-debit",
        "source": "cards_menu",
        "target": "debit_card_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-block",
        "source": "debit_card_menu",
        "target": "debit_auth_card",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-pin",
        "source": "debit_card_menu",
        "target": "debit_auth_card",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-limit",
        "source": "debit_card_menu",
        "target": "debit_auth_card",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-auth-otp",
        "source": "debit_auth_card",
        "target": "debit_auth_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-otp-verify",
        "source": "debit_auth_otp",
        "target": "debit_otp_verify",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-otp-true",
        "source": "debit_otp_verify",
        "target": "debit_action_router",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-otp-false",
        "source": "debit_otp_verify",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-block-true",
        "source": "debit_action_router",
        "target": "debit_block_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-block-false",
        "source": "debit_action_router",
        "target": "debit_pin_limit_router",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-pin-true",
        "source": "debit_pin_limit_router",
        "target": "ask_new_pin",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pin-success",
        "source": "ask_new_pin",
        "target": "pin_success",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-pin-false",
        "source": "debit_pin_limit_router",
        "target": "debit_limit_options",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-limit-1",
        "source": "debit_limit_options",
        "target": "debit_limit_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-limit-2",
        "source": "debit_limit_options",
        "target": "debit_limit_success",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-dc-limit-back",
        "source": "debit_limit_options",
        "target": "debit_card_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cards-credit",
        "source": "cards_menu",
        "target": "credit_card_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-bills",
        "source": "credit_card_menu",
        "target": "cc_auth_card",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-limit",
        "source": "credit_card_menu",
        "target": "cc_auth_card",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-block",
        "source": "credit_card_menu",
        "target": "cc_auth_card",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-auth-otp",
        "source": "cc_auth_card",
        "target": "cc_auth_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-otp-verify",
        "source": "cc_auth_otp",
        "target": "cc_otp_verify",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-otp-true",
        "source": "cc_otp_verify",
        "target": "cc_action_router",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-otp-false",
        "source": "cc_otp_verify",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-bills-true",
        "source": "cc_action_router",
        "target": "cc_bill_details",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-pay-tot",
        "source": "cc_bill_details",
        "target": "cc_pay_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-pay-min",
        "source": "cc_bill_details",
        "target": "cc_pay_success",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-pay-back",
        "source": "cc_bill_details",
        "target": "credit_card_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-bills-false",
        "source": "cc_action_router",
        "target": "cc_limit_block_router",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-limit-true",
        "source": "cc_limit_block_router",
        "target": "cc_limit_info",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-limit-confirm",
        "source": "cc_limit_info",
        "target": "cc_limit_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-limit-cancel",
        "source": "cc_limit_info",
        "target": "credit_card_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-limit-false",
        "source": "cc_limit_block_router",
        "target": "cc_other_options",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-other-1",
        "source": "cc_other_options",
        "target": "cc_other_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-other-2",
        "source": "cc_other_options",
        "target": "cc_other_success",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cc-other-3",
        "source": "cc_other_options",
        "target": "cc_other_success",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more1-loans",
        "source": "more_services_1",
        "target": "loans_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loans-1",
        "source": "loans_menu",
        "target": "loan_type_selection",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loans-2",
        "source": "loans_menu",
        "target": "loan_type_selection",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loans-3",
        "source": "loans_menu",
        "target": "loan_type_selection",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-select-0",
        "source": "loan_type_selection",
        "target": "ask_loan_name",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-select-1",
        "source": "loan_type_selection",
        "target": "ask_loan_name",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-select-2",
        "source": "loan_type_selection",
        "target": "ask_loan_name",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-name-mob",
        "source": "ask_loan_name",
        "target": "ask_loan_mobile",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-mob-inc",
        "source": "ask_loan_mobile",
        "target": "ask_loan_income",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-inc-amt",
        "source": "ask_loan_income",
        "target": "ask_loan_amount",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-amt-elig",
        "source": "ask_loan_amount",
        "target": "loan_elig_check",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-elig-true",
        "source": "loan_elig_check",
        "target": "loan_eligible_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loan-elig-false",
        "source": "loan_elig_check",
        "target": "loan_eligible_fallback",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more1-payments",
        "source": "more_services_1",
        "target": "payments_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pay-upi",
        "source": "payments_menu",
        "target": "ask_upi_id",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upi-id-amt",
        "source": "ask_upi_id",
        "target": "ask_upi_amount",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upi-amt-conf",
        "source": "ask_upi_amount",
        "target": "confirm_upi_pay",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upi-confirm-yes",
        "source": "confirm_upi_pay",
        "target": "ask_upi_pin",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upi-confirm-cancel",
        "source": "confirm_upi_pay",
        "target": "payments_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-upi-pin-success",
        "source": "ask_upi_pin",
        "target": "upi_pay_success",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pay-bank",
        "source": "payments_menu",
        "target": "bank_transfer_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-imps",
        "source": "bank_transfer_menu",
        "target": "ask_beneficiary_acct",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-neft",
        "source": "bank_transfer_menu",
        "target": "ask_beneficiary_acct",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-acct-ifsc",
        "source": "ask_beneficiary_acct",
        "target": "ask_beneficiary_ifsc",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-ifsc-amt",
        "source": "ask_beneficiary_ifsc",
        "target": "ask_transfer_amount",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-amt-otp",
        "source": "ask_transfer_amount",
        "target": "ask_transfer_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-otp-verify",
        "source": "ask_transfer_otp",
        "target": "verify_transfer_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-otp-true",
        "source": "verify_transfer_otp",
        "target": "transfer_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-bt-otp-false",
        "source": "verify_transfer_otp",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pay-intl",
        "source": "payments_menu",
        "target": "intl_transfer_info",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-intl-ack",
        "source": "intl_transfer_info",
        "target": "intl_transfer_ack",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more2-investments",
        "source": "more_services_2",
        "target": "investments_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-inv-mf",
        "source": "investments_menu",
        "target": "mf_sip_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-mf-explore",
        "source": "mf_sip_menu",
        "target": "collect_investor_details",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-mf-sip",
        "source": "mf_sip_menu",
        "target": "collect_investor_details",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pan-verify",
        "source": "collect_investor_details",
        "target": "investor_kyc_verify",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-true",
        "source": "investor_kyc_verify",
        "target": "investor_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-kyc-false",
        "source": "investor_kyc_verify",
        "target": "investor_fallback",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-inv-demat",
        "source": "investments_menu",
        "target": "demat_info",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-demat-linked",
        "source": "demat_info",
        "target": "demat_ack",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-inv-ins",
        "source": "investments_menu",
        "target": "insurance_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-ins-1",
        "source": "insurance_menu",
        "target": "ins_success",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-ins-2",
        "source": "insurance_menu",
        "target": "ins_success",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-ins-3",
        "source": "insurance_menu",
        "target": "ins_success",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more2-fd",
        "source": "more_services_2",
        "target": "fd_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-open",
        "source": "fd_menu",
        "target": "ask_fd_cust_id",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-close",
        "source": "fd_menu",
        "target": "ask_fd_cust_id",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-cert",
        "source": "fd_menu",
        "target": "ask_fd_cust_id",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-cust-amt",
        "source": "ask_fd_cust_id",
        "target": "ask_fd_amount",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-amt-ten",
        "source": "ask_fd_amount",
        "target": "ask_fd_tenure",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-ten-calc",
        "source": "ask_fd_tenure",
        "target": "fd_calc_returns",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-confirm-yes",
        "source": "fd_calc_returns",
        "target": "fd_otp",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-confirm-cancel",
        "source": "fd_calc_returns",
        "target": "fd_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fd-otp-success",
        "source": "fd_otp",
        "target": "fd_success",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more3-cheque",
        "source": "more_services_3",
        "target": "cheque_menu",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-req",
        "source": "cheque_menu",
        "target": "ask_chq_acct",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-stop",
        "source": "cheque_menu",
        "target": "ask_chq_acct",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-pos",
        "source": "cheque_menu",
        "target": "ask_chq_acct",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-acct-otp",
        "source": "ask_chq_acct",
        "target": "ask_chq_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-otp-verify",
        "source": "ask_chq_otp",
        "target": "chq_otp_verify",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-otp-true",
        "source": "chq_otp_verify",
        "target": "chq_action_router",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-otp-false",
        "source": "chq_otp_verify",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-router-req",
        "source": "chq_action_router",
        "target": "chq_request_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-chq-router-other",
        "source": "chq_action_router",
        "target": "chq_stop_success",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more3-support",
        "source": "more_services_3",
        "target": "support_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-sup-complaint",
        "source": "support_menu",
        "target": "ask_complaint_cat",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cat-1",
        "source": "ask_complaint_cat",
        "target": "ask_complaint_desc",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cat-2",
        "source": "ask_complaint_cat",
        "target": "ask_complaint_desc",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-cat-3",
        "source": "ask_complaint_cat",
        "target": "ask_complaint_desc",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-desc-scr",
        "source": "ask_complaint_desc",
        "target": "ask_screenshot_upload",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-scr-success",
        "source": "ask_screenshot_upload",
        "target": "complaint_success",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-sup-fraud",
        "source": "support_menu",
        "target": "fraud_report_menu",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-all",
        "source": "fraud_report_menu",
        "target": "fraud_block_acct",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-unauth",
        "source": "fraud_report_menu",
        "target": "fraud_block_acct",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-acct-otp",
        "source": "fraud_block_acct",
        "target": "fraud_otp",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-otp-verify",
        "source": "fraud_otp",
        "target": "fraud_otp_verify",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-otp-true",
        "source": "fraud_otp_verify",
        "target": "fraud_block_success",
        "sourceHandle": "true",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-fraud-otp-false",
        "source": "fraud_otp_verify",
        "target": "acct_otp_error",
        "sourceHandle": "false",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-sup-agent",
        "source": "support_menu",
        "target": "agent_connect",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-more3-locator",
        "source": "more_services_3",
        "target": "locator_menu",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loc-gps",
        "source": "locator_menu",
        "target": "ask_locator_pin",
        "sourceHandle": "btn-0",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loc-pin",
        "source": "locator_menu",
        "target": "ask_locator_pin",
        "sourceHandle": "btn-1",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-pin-search",
        "source": "ask_locator_pin",
        "target": "show_nearest_locations",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-loc-hours",
        "source": "locator_menu",
        "target": "branch_hours_info",
        "sourceHandle": "btn-2",
        "animated": false,
        "style": {
          "stroke": "#94a3b8",
          "strokeWidth": 2
        }
      }
    ]
  }
};
