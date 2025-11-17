import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons'; 
import { TextInput } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// === Screen Components ===

const DetailScreen = ({ route }) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{route.params.name}</Text>
    <Text style={styles.subtitle}>
      This screen will contain the detailed financial guide for: {route.params.name}.
    </Text>
    <StatusBar style="auto" />
  </View>
);

const StartingCollegeScreen = (props) => <DetailScreen name="Starting College" {...props} />;
const FirstHouseScreen = (props) => <DetailScreen name="FirstHouse" {...props} />;
const MovingOutScreen = (props) => <DetailScreen name="Moving Out" {...props} />;
const PayingOffDebtScreen = (props) => <DetailScreen name="Paying Off Debt" {...props} />;

// Main Home Screen 
const HomeScreen = () => {
    const insets = useSafeAreaInsets(); 
    const milestones = [
        'Create your profile',
        'Set monthly savings goal',
        'Build personalized budget',
        'Complete financial assessment',
        'Create wellness roadmap',
    ];

    return (
        <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={[
                styles.homeContainer, 
                { paddingTop: insets.top + 10 } 
            ]}
        >
            <Text style={styles.greetingText}>Good morning, Sarah</Text>
            
            {/* Progress Block */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressTextHeader}>Your Progress</Text>
                <Text style={styles.progressPercentage}>40%</Text>
                <View style={styles.progressBarBackground}>
                    <View style={styles.progressBarFill}></View>
                </View>
                <Text style={styles.progressTextFooter}>2 of 5 milestones completed</Text>
            </View>

            {/* Financial Milestones List (Static Visual) */}
            <Text style={styles.sectionHeader}>Financial Milestones</Text>
            <View style={styles.milestonesList}>
                {milestones.map((milestone, index) => (
                    <View key={index} style={styles.milestoneItem}>
                        <Text style={styles.milestoneText}>{milestone}</Text>
                    </View>
                ))}
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Set Monthly Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Build Personalized Budget</Text>
            </TouchableOpacity>
            
            {/* Upcoming Reminders (Static Visual) */}
            <Text style={styles.sectionHeader}>Upcoming Reminders:</Text>
            <View style={styles.reminderItem}>
                <View style={[styles.reminderDot, { backgroundColor: '#CC0000' }]} />
                <View>
                    <Text style={styles.reminderText}>Set monthly savings goal</Text>
                    <Text style={styles.reminderSubtext}>Tomorrow, 9:00 am</Text>
                </View>
            </View>
            <View style={styles.reminderItem}>
                <View style={[styles.reminderDot, { backgroundColor: '#A2C8A1' }]} />
                <View>
                    <Text style={styles.reminderText}>Build personalized budget</Text>
                    <Text style={styles.reminderSubtext}>Oct 20, 10:00 am</Text>
                </View>
            </View>
            
            <StatusBar style="auto" />
        </ScrollView>
    );
};


const BudgetScreen = () => {
  const insets = useSafeAreaInsets();
  const [income, setIncome] = useState(4200);

  // Fixed
  const [rent, setRent] = useState(800);
  const [transport, setTransport] = useState(150);

  // Variable
  const [groceries, setGroceries] = useState(800);
  const [entertainment, setEntertainment] = useState(150);

  // Savings
  const [savings, setSavings] = useState(800);

  const remaining =
    income -
    (rent + transport + groceries + entertainment + savings);

  // Helper component for uniform slider-based expenses
  const ExpenseSlider = ({ label, value, onValueChange, min, max, step = 10 }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeaderRow}>
        <Text style={styles.expenseLabel}>{label}</Text>
        <Text style={styles.expenseValue}>${value}</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={onValueChange}
        step={step}
        minimumTrackTintColor="#89A488"
        thumbTintColor="#89A488"
      />
    </View>
  );

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.budgetContainerContent, 
        { paddingTop: insets.top + 10 } // ⬅️ THIS APPLIES THE PADDING
      ]}
    >
      {/* TITLE & SUBTITLE */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.mainTitle}>Build Your Budget</Text>
        <Text style={styles.subtitle}>
          Create a personalized monthly budget based on your income and expenses.
        </Text>
      </View>

      {/* INCOME CARD */}
      <View style={styles.budgetCard}>
        <Text style={styles.sectionHeaderNoMargin}>Monthly Income</Text>
        <TextInput
          style={styles.incomeInput}
          value={String(income)}
          onChangeText={(text) => {
            const num = Number(text.replace(/[^0-9]/g, ''));
            setIncome(isNaN(num) ? 0 : num);
          }}
          keyboardType="numeric"
          placeholder="$0"
          maxLength={7}
        />
      </View>

      {/* FIXED EXPENSES */}
      <View style={styles.budgetCard}>
        <Text style={styles.sectionHeaderNoMargin}>Fixed Expenses</Text>
        <ExpenseSlider 
          label="Rent" 
          value={rent} 
          onValueChange={setRent} 
          min={0} 
          max={3000} 
          step={50} 
        />
        <ExpenseSlider 
          label="Transportation" 
          value={transport} 
          onValueChange={setTransport} 
          min={0} 
          max={500} 
          step={10} 
        />
      </View>

      {/* VARIABLE EXPENSES */}
      <View style={styles.budgetCard}>
        <Text style={styles.sectionHeaderNoMargin}>Variable Expenses</Text>
        <ExpenseSlider 
          label="Groceries" 
          value={groceries} 
          onValueChange={setGroceries} 
          min={0} 
          max={1500} 
          step={20} 
        />
        <ExpenseSlider 
          label="Entertainment" 
          value={entertainment} 
          onValueChange={setEntertainment} 
          min={0} 
          max={500} 
          step={10} 
        />
      </View>

      {/* SAVINGS */}
      <View style={styles.budgetCard}>
        <Text style={styles.sectionHeaderNoMargin}>Savings</Text>
        <ExpenseSlider 
          label="Savings Goal" 
          value={savings} 
          onValueChange={setSavings} 
          min={0} 
          max={2000} 
          step={20} 
        />
      </View>

      {/* REMAINING */}
      <View style={styles.budgetCard}>
        <Text style={styles.sectionHeaderNoMargin}>Remaining</Text>
        <Text
          style={[
            styles.remainingText,
            { color: remaining >= 0 ? '#89A488' : '#CC0000' },
          ]}
        >
          {remaining >= 0
            ? `Great! You have money left.`
            : `Warning! You've overspent.`}
        </Text>
        <Text 
          style={[
            styles.remainingAmount, 
            { color: remaining >= 0 ? '#89A488' : '#CC0000' }
          ]}
        >
          ${remaining}
        </Text>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const RoadmapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const contentPages = [
    { name: 'Starting College', key: 'StartingCollege', icon: 'ios-school' },
    { name: 'First Job', key: 'FirstHouse', icon: 'ios-briefcase' }, 
    { name: 'Moving Out', key: 'MovingOut', icon: 'ios-home' },
    { name: 'Paying Off Debt', key: 'PayingOffDebt', icon: 'ios-card' },
  ];

  return (
    <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
            styles.container,
            { paddingTop: insets.top + 10 } 
        ]}
    >
      <Text style={styles.roadmapHeader}>Financial Wellness Roadmap</Text>
      <Text style={styles.roadmapSubtext}>Navigate life transitions with personalized financial planning.</Text>
      
      <Text style={[styles.sectionHeader, { marginTop: 15 }]}>Select Your Scenario</Text>
      <View style={styles.scenarioGrid}>
        {contentPages.map((page) => (
          <TouchableOpacity
            key={page.key}
            style={styles.scenarioCard}
            onPress={() => navigation.navigate('HomeStack', { screen: page.key, params: { name: page.name } })}
          >
            <Ionicons name={page.icon} size={36} color="#89A488" style={{ marginBottom: 10 }} />
            <Text style={styles.cardText}>{page.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.savingsGoalBox}>
        <Text style={styles.savingsGoalHeader}>Monthly Savings Goal</Text>
        <Text style={styles.savingsGoalText}>$100</Text>
      </View>
      
      <StatusBar style="auto" />
    </ScrollView>
  );
};

// HELP SCREEN
const HelpScreen = () => {
    const insets = useSafeAreaInsets();
    const phoneNumber = '9728832941';
    const emailAddress = 'financial.aid@utdallas.edu';

    return (
      <ScrollView style={styles.scrollView}>
        <View style={[styles.helpContainer, { paddingTop: insets.top + 10 }]}>
            <Text style={[styles.mainTitle, {textAlign: 'left'}]}>Help & Support</Text>

            {/* Contact Advisor Section (Olive Green Block) */}
            <View style={styles.contactBlock}>
                <Text style={styles.contactBlockHeader}>Contact UT Dallas Advisor</Text>
                <Text style={styles.contactBlockSubtext}>Connect with financial experts</Text>
                
                <TouchableOpacity 
                    style={styles.contactButton} 
                    onPress={() => Linking.openURL(`mailto:${emailAddress}`)}
                >
                    <Text style={styles.contactButtonText}>Email Financial Aid</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.contactButton} 
                    onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                >
                    <Text style={styles.contactButtonText}>Call (972) 883-2941</Text>
                </TouchableOpacity>
            </View>

            {/* UTD Financial Resources Section */}
            <View style={styles.resourceBlock}>
                <Text style={styles.resourceTitle}>UTD Financial Resources:</Text>
                
                <Text style={styles.resourceDetailTitle}>Office of Financial Aid</Text>
                <Text style={styles.resourceDetailText}>Student Services Building (SSB), 2nd Floor</Text>
                <Text style={styles.resourceDetailText}>800 W. Campbell Rd, Richardson, TX 75080</Text>
                
                <Text style={[styles.resourceDetailTitle, { marginTop: 15 }]}>{'(972) 883-2941'}</Text>
                <Text style={styles.resourceDetailSubtext}>Financial Aid Office</Text>
                
                <Text style={[styles.resourceDetailTitle, { marginTop: 10 }]}>{'financial.aid@utdallas.edu'}</Text>
                
                <Text style={[styles.resourceDetailTitle, { marginTop: 15 }]}>Monday - Friday</Text>
                <Text style={styles.resourceDetailText}>8:00 AM - 5:00 PM</Text>
            </View>

            {/* Additional Resources Section */}
            <Text style={[styles.sectionHeader, { marginTop: 25 }]}>Additional Resources</Text>
            
            <View style={styles.additionalResourcesList}>
                <TouchableOpacity style={styles.additionalResourceCard}>
                    <Text style={styles.resourceDetailTitle}>Bursar Office</Text>
                    <Text style={styles.resourceDetailSubtext}>Tuition & Payments</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.additionalResourceCard}>
                    <Text style={styles.resourceDetailTitle}>Student Success Center</Text>
                    <Text style={styles.resourceDetailSubtext}>Academic & career support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.additionalResourceCard}>
                    <Text style={styles.resourceDetailTitle}>Scholarship Portal</Text>
                    <Text style={styles.resourceDetailSubtext}>Search & apply for scholarships</Text>
                </TouchableOpacity>
            </View>

        </View>
        <StatusBar style="auto" />
      </ScrollView>
    );
};

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  
  // Helper Component for Settings/Connected Accounts Rows
  const ProfileRow = ({ title, subtext, icon, onPress }) => (
    <TouchableOpacity 
      style={styles.profileRow} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Optional: Add icon if needed later, keeping the structure generic for now */}
      <Text style={styles.profileRowText}>{title}</Text>
      {/* The image doesn't show a right arrow, but it's a common pattern. I'll omit it to match the image exactly. */}
    </TouchableOpacity>
  );

  // Helper Component for Sign Out Button
  const SignOutButton = ({ onPress }) => (
    <TouchableOpacity 
      style={[styles.signOutButton, { marginTop: 20 }]} // Add some space above
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.signOutButtonText}>Sign Out</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={[
        styles.profileContainer, 
        { paddingTop: insets.top + 10 }
      ]}
    >
      {/* 1. User Header */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={75} color="#333333" />
        <Text style={styles.profileName}>Sarah Johnson</Text>
      </View>
      
      {/* 2. Account Settings */}
      <Text style={styles.profileSectionHeader}>Account Settings</Text>
      <View style={styles.profileBlock}>
        <ProfileRow title="Personal Information" onPress={() => console.log('Go to Personal Information')} />
        <ProfileRow title="Notifications" onPress={() => console.log('Go to Notifications')} />
        <ProfileRow title="Security & Privacy" onPress={() => console.log('Go to Security & Privacy')} />
      </View>

      {/* 3. Connected Accounts */}
      <Text style={styles.profileSectionHeader}>Connected Accounts</Text>
      <View style={styles.profileBlock}>
        <ProfileRow title="Chase Bank ********" onPress={() => console.log('Manage Chase')} />
        <ProfileRow title="Capital One ********" onPress={() => console.log('Manage Capital One')} />
      </View>

      {/* 4. Support */}
      <Text style={styles.profileSectionHeader}>Support</Text>
      <View style={styles.profileBlock}>
        <ProfileRow title="Help Center" onPress={() => console.log('Go to Help Center')} />
      </View>
      
      {/* 5. Sign Out Button (Styled like the Support row, but stands alone) */}
      {/* The image shows a full-width button that is visually separate from the Support block */}
      <SignOutButton onPress={() => console.log('Signing out...')} />


      <StatusBar style="auto" />
    </ScrollView>
  );
};


// --- Navigators ---

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#89A488' }, 
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <HomeStack.Screen name="StartingCollege" component={StartingCollegeScreen} />
      <HomeStack.Screen name="FirstHouse" component={FirstHouseScreen} />
      <HomeStack.Screen name="MovingOut" component={MovingOutScreen} />
      <HomeStack.Screen name="PayingOffDebt" component={PayingOffDebtScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const RootApp = () => (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Budget':
                iconName = focused ? 'calculator' : 'calculator-outline';
                break;
              case 'Roadmap':
                iconName = focused ? 'map' : 'map-outline';
                break;
              case 'Help':
                iconName = focused ? 'help-circle' : 'help-circle-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#89A488', 
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Roadmap" component={RoadmapScreen} />
        <Tab.Screen name="Help" component={HelpScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
);

// The main export function wraps the RootApp in the SafeAreaProvider
export default function App() {
    return (
        <SafeAreaProvider>
            <RootApp />
        </SafeAreaProvider>
    );
}


const styles = StyleSheet.create({
  // --- BASE STYLES ---
  screen: {
    flex: 1,
    backgroundColor: '#F8F5EE', // Soft Beige
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
    minHeight: '100%',
  },
  // --- TYPOGRAPHY & HEADERS ---
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333', 
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333', 
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280', 
    lineHeight: 24,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333', 
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 25,
    marginBottom: 15,
  },
// --- BUDGET SCREEN STYLES ---
  incomeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    paddingVertical: 5,
  },

  // sectionHeader: { // Used in Home, Roadmap, Help
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#333333',
  //   marginTop: 25,
  //   marginBottom: 15,
  // },
  sectionHeaderNoMargin: { // New style for card titles
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15, // Provide spacing below the card title
  },

  budgetContainerContent: { // Content container for the entire screen
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20, // Space between cards
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  incomeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    paddingVertical: 5,
    // Removed border for a cleaner look within the card
  },

  // Expense Items structure for better layout
  expenseItem: {
    marginBottom: 15,
    marginTop: 5,
  },
  expenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  expenseLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  // Remaining section
  remainingText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 5,
  },
  remainingAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },

  // --- HOME SCREEN STYLES (Refined Spacing) ---
  homeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  greetingText: {
    fontSize: 25,
    color: '#333333',
    marginBottom: 15,
    marginTop: 10,
    fontWeight: '500', 
  },
  progressContainer: {
      backgroundColor: '#89A488', 
      borderRadius: 12,
      padding: 20,
      width: '100%',
      marginBottom: 25, 
  },
  progressTextHeader: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
  },
  progressPercentage: {
      position: 'absolute', 
      top: 20, 
      right: 20,
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
  },
  progressBarBackground: {
      height: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 5,
      marginTop: 10, 
      marginBottom: 8,
  },
  progressBarFill: {
      height: 10,
      backgroundColor: '#A2C8A1',
      width: '40%', 
      borderRadius: 5,
  },
  progressTextFooter: {
      color: 'white',
      fontSize: 14,
  },
  // Milestones list structure
  milestonesList: {
      backgroundColor: 'white',
      borderRadius: 12,
      shadowColor: '#333333', 
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 3,
      marginBottom: 25, 
  },
  milestoneItem: {
      paddingVertical: 18, 
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
  },
  milestoneText: {
      fontSize: 16,
      color: '#333333',
  },
  actionButton: {
      backgroundColor: 'white',
      padding: 16, 
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
      marginBottom: 12, 
      shadowColor: '#333333', 
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
  },
  actionButtonText: {
      color: '#333333',
      fontWeight: '600',
      fontSize: 16,
  },
  reminderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10, 
  },
  reminderDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 12, 
  },
  reminderText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#333333',
  },
  reminderSubtext: {
      fontSize: 13,
      color: '#6b7280',
  },


  // --- ROADMAP STYLES (Refined Grid Spacing) ---
  roadmapHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  roadmapSubtext: {
    fontSize: 16,
    color: '#6b7280', 
    marginBottom: 20, 
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10, 
  },
  scenarioCard: {
    backgroundColor: 'white',
    width: '48%', 
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15, 
    minHeight: 140, 
    shadowColor: '#333333', 
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  savingsGoalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '100%',
    marginTop: 25, 
    shadowColor: '#333333', 
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
  },
  savingsGoalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  savingsGoalText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },

  // --- HELP SCREEN STYLES (Refined Spacing) ---
  helpContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  contactBlock: {
    backgroundColor: '#89A488', 
    borderRadius: 12,
    padding: 20,
    marginBottom: 25, 
    marginTop: 10,
  },
  contactBlockHeader: {
    color: 'white',
    fontSize: 18, 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactBlockSubtext: {
    color: 'white',
    fontSize: 13, 
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: 'white',
    padding: 14, 
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10, 
  },
  contactButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  resourceBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25, 
    shadowColor: '#333333', 
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  resourceDetailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 22,
  },
  resourceDetailSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  resourceDetailText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  additionalResourcesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#333333', 
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
  },
  additionalResourceCard: {
    paddingVertical: 15,
    paddingHorizontal: 20, 
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // --- PROFILE SCREEN STYLES ---
  profileContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE', // Soft Beige
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40, // Space below header
    marginTop: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 15,
  },
  profileSectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280', // Slightly muted color for section titles
    marginBottom: 10,
    marginTop: 15, // Space above section title
  },
  profileBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#333333',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden', // Ensures the border radius clips the inner rows
    marginBottom: 10, // Space below the main block
  },
  profileRow: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', // Light separator line
  },
  profileRowText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CC0000', // Red for emphasis (You can change this)
  },
});